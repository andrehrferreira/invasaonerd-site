
import { mongodb } from "@dekproject/scope"
import { ObjectId } from 'mongodb'


export const updateUsersFromProfile = async (req, res) => {
    try {

        const users = await mongodb.collection('users').find({
            profile: {
                $exists: false
            }
        }).toArray()

        await Promise.all(users.map(async user => {
            const userId = user._id
            user.profile = {
                local: {
                    fullname: user.name,
                    avatar: user.avatar,
                    username: user.user.trim().toLowerCase(),
                    pass: user.pass,
                    email: user.email.trim().toLowerCase()
                }
            }
            user.emails = [user.email]
            delete user._id

            delete user.email
            delete user.avatar
            delete user.user
            delete user.pass
            delete user.name
            await mongodb.collection('users').updateOne({
                _id: ObjectId(userId)
            }, {
                $set: user,
                $unset: {
                    email: '',
                    avatar: '',
                    user: '',
                    pass: '',
                    name: ''
                }
            })
        }))

        res.apiSend()

    } catch (error) {
        res.apiError(error)
    }
}

export const mongoIndexUsers = async (req, res) => {
    try {
        await dropIndex('email')
        await dropIndex('user')
        await dropIndex('pass')
        await createIndex('emails')
        await createIndex('profile.local.user')
        res.apiSend()
    } catch (error) {
        res.apiError(error)
    }
}

async function createIndex(index) {
    try {
        await mongodb.collection('users').createIndex({ [index]: 1 })
    } catch (error) {

    }
}
async function dropIndex(index) {
    try {
        await mongodb.collection('users').dropIndex({ [index]: 1 })
    } catch (error) {

    }
}
