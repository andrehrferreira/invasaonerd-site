
import { ObjectId } from 'mongodb'
import { mongodb } from '@dekproject/scope'
import { createUserByUsernameAndEmailAndPassword } from './auth';


export const createNewInvite = async (req, res) => {
    try {
        const user = req.user

        const inviteId = await createInvite(user._id)

        const url = `${process.env.PROXY_URL}/invites/register/${inviteId}`


        res.apiSend(url)

    } catch (error) {
        res.apiError(error)
    }
}
export const registerUserByInviteId = async (req, res) => {
    try {
        const { inviteId } = req.params
        const { dataUser } = req.body

        await registerByInviteId(inviteId, dataUser)

        res.apiSend()

    } catch (error) {
        res.apiError(error)
    }
}

async function createInvite(userId) {
    return new Promise(async (resolve, reject) => {
        try {

            const user = await mongodb.collection('users').findOne({
                _id: ObjectId(userId)
            })

            if (!user) return reject('Usuário não existe')

            if (user.usersInvites && user.usersInvites.length > 10) return reject('O limite de convites foi atingido')


            const inviteSchema = {
                userId,
                created: new Date(),
            }

            const { insertedId } = await mongodb.collection('invites').insertOne(inviteSchema)

            const inviteId = insertedId.toHexString()

            await mongodb.collection('users').updateOne({
                _id: ObjectId(userId)
            }, {
                    $push: {
                        usersInvites: ObjectId(inviteId)
                    }
                })

            resolve(inviteId)

        } catch (error) {
            reject(error)
        }
    })
}

async function registerByInviteId(inviteId, dataUser = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const invite = await mongodb.collection('invites').findOne({
                _id: ObjectId(inviteId)
            })

            if (!invite) return reject('Convite não existe')

            if (invite.userInviteId) return reject('O convite já foi utilizado')

            const userId = await createUserByUsernameAndEmailAndPassword(dataUser)

            await mongodb.collection('invites').updateOne({
                _id: ObjectId(inviteId)
            }, {
                $set: {
                    userInviteId: ObjectId(userId),
                    accountCreated: new Date()
                }
            })
            resolve(userId)
        } catch (err) {
            reject(err)
        }
    })
}