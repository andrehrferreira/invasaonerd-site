
import { ObjectId } from 'mongodb'
import { mongodb } from '@dekproject/scope'
import gmailSend from '../core/email'
import schema from '../core/schema'
import { cache } from '../core/cache'
import fs from 'fs'
import path from 'path'


const BASE_URL = process.env.BASE_URL
const PROXY_URL = process.env.PROXY_URL

export const getBugs = async (req, res) => {
    try {


        const { sortBy, descending } = req.query

        let page = (req.query.page) ? parseInt(req.query.page) : 1
        let limit = (req.query.rowsPerPage) ? parseInt(req.query.rowsPerPage) : 10
        let skip = (req.query.skip) ? parseInt(req.query.skip) : ((page - 1) * limit);
        let sort = sortBy ? { [sortBy]:  descending ? -1 : 1} : {}
        let bugs = await mongodb.collection('bugs')
            .find({ solved: false })
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .toArray()

        let totalItems = await mongodb.collection('bugs')
            .find({ solved: false })
            .count()

        bugs = await Promise.all(bugs.map(async bug => {
            await cache('bugs', bug._id, bug, 'inAday')
            bug.screenshots = bug.screenshots.map((img, index) => {
                return BASE_URL + "/bugs/" + bug._id + "/" + index
            })
            return bug
        }))
        res.json({ items: bugs, totalItems })
    } catch (err) {
        res.sendStatus(500)
    }
}

export const getScreenshotByBugId = async (req, res) => {
    const { bug } = req;
    const { index } = req.params
    let img = null;
    if (bug && bug.screenshots) {
        img = new Buffer.from(bug.screenshots[index].replace("data:application/octet-stream;base64,", ""), 'base64')
    } else {
        img = fs.readFileSync(path.resolve(__dirname, '../assets/avatardefault.jpeg'));
    }
    res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': img.length
    })
    return res.end(img, 'binary');
}


export const getBugById = async (req, res, next, bugId) => {
    try {
        const bug = await new Promise((resolve, reject) => {
            cache("bugs", bugId).then((bug) => {
                resolve(bug)
            }).catch(async () => {
                try {
                    const bug = await mongodb.collection('bugs').findOne({
                        _id: ObjectId(bugId)
                    });
                    if (bug) {
                        await cache("bugs", bug._id, bug, 'inAday')
                    }
                    resolve(bug)
                } catch (error) {
                    reject(error)
                }
            })
        })
        req.bug = bug;
        next();
    } catch (error) {
        res.status(500).send()
    }
}


export const sendBug = async (req, res) => {
    let { bug } = req.body
    bug.user = req.user.email
    bug.timestamp = new Date().getTime()
    try {
        let bugId = null
        const result = await mongodb.collection('bugs').insertOne(bug)
        
        if (result.insertedId) 
            bugId = result.insertedId.toHexString()
            
        const attachments = bug.screenshots.map((img, index) => {
            return {
                filename: `images${index + 1}.jpeg`,
                content: img.replace('data:application/octet-stream;base64', ''),
                encoding: 'base64'
            }
        })
        delete bug.screenshots
        const tos = schema.email.adminEmails
        tos.push('gislainy.velasco@vigiadepreco.com.br')

        gmailSend.sendMail({
            to: tos,
            from: schema.email.user,
            subject: schema.email.subjects.bug,
            html: `
					<h1>Um BUG foi reportado</h1>
					<p><strong>Titulo:</strong> ${bug.title}</p>
					<p><strong>Usuário:</strong> ${bug.user}</p>
					<p><strong>Data:</strong> ${new Date(bug.timestamp).toLocaleString()}</p>
					<p><strong>Detalhes:</strong> ${bug.details}</p>
					<p><strong>URL para mais informações:<strong> ${PROXY_URL}/bugs/${bugId}</p>
				`,
            attachments
        })
        res.send({ error: false })
    } catch (err) {
        res.status(500).send({ error: true, moreinfo: err })
    }
}

export const getBug = async (req, res) => {
    const { bug } = req
    bug.screenshots = bug.screenshots.map((img, index) => {
        return BASE_URL + "/bugs/" + bug._id + "/" + index
    })
    res.json(bug)
}