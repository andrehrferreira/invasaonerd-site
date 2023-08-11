import { cache } from '../core/cache'
import { ObjectId } from 'mongodb'
import { mongodb, mongoose } from "@dekproject/scope"
import { getMetagas } from './pages'
import "../models/pages"

const Pages = mongoose.model("Pages")

export const getPagesList = async (req, res) => {
    req.paginate.findFields = ["title", "nickname", "url", "englishTitle"];
    req.paginate.likeMode = true;
    console.log(JSON.stringify(req.paginate.query()))

    Pages.find(req.paginate.query(), "title nickname url categories feedbackDate removed engagement seo", req.paginate.options()).exec(async (err, docs) => {
        if (err) res.apiError(err.message);
        else res.apiSend(req.paginate.send(docs, await Pages.countDocuments(req.paginate.query())));
    });
}

export const getPage = async (req, res) => {
    const { pageId } = req.params
    Pages.findOne({ _id: ObjectId(pageId) }, "title nickname url categories feedbackDate removed engagement seo ", req.paginate.options()).exec(async (err, page) => {
        if (err) res.apiError(err.message);
        else {
            const metatags = await getMetagas(page, 'search')
            page.metatags = metatags
            const p = Object.assign({}, page._doc, { metatags })
            res.apiSend(p);
        }
    });
}

export const setEngagement = async (req, res) => {
    try {
        const { pageId } = req.params
        const { engagement } = req.body
        await mongodb.collection('pages').updateOne({
            _id: ObjectId(pageId)
        }, {
                $set: {
                    engagement
                }
            })
        res.apiSend()
    } catch (error) {
        res.apiError(err.message);
    }
}

export const setSEO = async (req, res) => {
    try {
        const { pageId } = req.params
        const { seo } = req.body
        await mongodb.collection('pages').updateOne({
            _id: ObjectId(pageId)
        }, {
                $set: {
                    seo
                }
            })
        res.apiSend()
    } catch (error) {
        res.apiError(err.message);
    }
}