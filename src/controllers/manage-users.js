import { cache } from '../core/cache'
import { ObjectId } from 'mongodb'
import { mongodb, mongoose } from "@dekproject/scope"
import "../models/users"

const Users = mongoose.model("Users")

export const getUsersList = async (req, res) => {
    try {
        req.paginate.findFields = ["profile", "emails"];
        req.paginate.likeMode = true;
        console.log(JSON.stringify(req.paginate.query()))

        Users.find(req.paginate.query(), "emails blacklist admin superadmin created profile points", req.paginate.options()).exec(async (err, docs) => {
            if (err) res.apiError(err.message);
            else res.apiSend(req.paginate.send(docs, await Users.countDocuments(req.paginate.query())));
        });

    } catch (error) {
        res.apiError(error)
    }
}

export const getUser = async (req, res) => {
    try {

        const { userId } = req.params
        Users.findOne({ _id: ObjectId(userId) }, "emails blacklist admin superadmin created profile points", req.paginate.options()).exec(async (err, user) => {
            if (err) res.apiError(err.message);
            else {
                res.apiSend(user);
            }
        });

    } catch (error) {
        res.apiError(error)
    }
}

export const setUser = async (req, res) => {
    try {
        const { userId } = req.params
        const { admin, superadmin, blacklist } = req.body
        await mongodb.collection('users').updateOne({
            _id: ObjectId(userId)
        }, {
                $set: {
                    admin,
                    superadmin,
                    blacklist
                }
            })
        res.apiSend()
    } catch (error) {
        res.apiError(err.message);
    }
}