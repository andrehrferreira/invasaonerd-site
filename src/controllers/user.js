
import { mongodb } from "@dekproject/scope"
import { ObjectId } from 'mongodb'
import { cache } from '../core/cache'
import { getUserSuggestions } from './new-user'
import fs from 'fs'
import path from 'path'

const BASE_URL = process.env.BASE_URL

export const getPages = async (req, res) => {
	const { pages, notifications } = req.user
	if (!pages) return res.status(401).send()
	try {
		let userpages = await getPagesByUser(req.user._id, pages, notifications)
		return res.send(userpages)
	} catch (error) {
		return res.status(500).send({ error })
	}
}

export const getFeeds = async (req, res) => {
	const { pages, blackListPages, noSuggestions } = req.user
	const { skip, loadMoreSuggestions, cachePage } = req.query
	try {
		let feeds = await getFeedByPagesIds(pages, skip || 0)
		let suggestions = undefined

		try {
			suggestions = Number(loadMoreSuggestions)
				&& await getUserSuggestions({ user: req.user, cachePage: Number(cachePage) })
		} catch (err) {
			//Erro aos buscar as sugestões
		}
		const user = {
			blackListPages: blackListPages || [],
			noSuggestions: noSuggestions || [],
			pages
		}
		return res.send({ feeds, suggestions, user })
	} catch (error) {
		console.log(error)
		return res.status(500).send({ error })
	}
}

export const getNotifications = async (req, res) => {
	try {
		const notifications = await deleteNotificationsOlderThanOneMonth(req.user._id, req.user.notifications)
		return res.json(notifications)
	} catch (error) {
		return res.status(500).send({ error })
	}
}

export const setNotifications = async (req, res) => {
	try {
		const { notification } = req.body
		let { notifications, _id } = req.user
		notifications = notifications.map(n => {
			if (n.timestamp === notification.timestamp) {
				n.clicked = true
				n.new = false
			}
			return n
		})
		await await setUserField(req.user._id, 'notifications', notifications)

		return res.status(204).send()
	} catch (error) {
		return res.status(500).send({ error })
	}
}

export const setNotificationsByPageId = async (req, res) => {
	try {
		const { pageId } = req.params
		console.log({ pageId })
		let { notifications, _id } = req.user
		notifications = notifications.map(n => n.pageId != pageId)
		await setUserField(_id, 'notifications', notifications)
		return res.status(204).send()
	} catch (error) {
		return res.status(500).send({ error })
	}
}

export const setPagesFollowByUserId = async (req, res) => {
	try {
		let { pageId, notifications } = req.body

		if (!pageId) return res.status(400).send({ error: 'pageId is required' })
		else pageId = parseInt(pageId)
		let { pages, _id } = req.user
		const query = { _id: ObjectId(_id) }
		let isFollow = true
		const hasPages = !!(pages && pages.length)
		const followPage = hasPages ? pages.includes(pageId) : false
		let set = {}
		if (!hasPages) {
			pages = [pageId]
			set = { $set: { pages: [pageId] } }
		} else if (!followPage) {
			pages.push(pageId)
			set = { $push: { pages: pageId } }
		} else {
			isFollow = false
			pages = pages.filter(p => p != pageId)
			set = { $pull: { pages: { $in: [pageId] } } }
		}
		const val = followPage ? -1 : 1
		await mongodb.collection('pages').updateOne(query, { $inc: { followers: val } })
		const { result } = await mongodb.collection('users').updateOne(query, set)


		await getPagesByUserMongo(_id, pages, notifications)


		res.send({ status: result.ok, isFollow })

	} catch (error) {
		return res.status(500).send({ error })
	}
}

export const getAvatarByUserId = async (req, res) => {
	// try {
	// 	// const { userId } = req.params
	// 	// const user = await mongodb.collection('users').findOne({
	//     //     $and: [{
	//     //         blacklist: { $ne: true }
	//     //     }, {
	//     //         _id: ObjectID(userId)
	//     //     }]
	// 	// })

	// } catch (error) {
	// }
	var img = fs.readFileSync(path.resolve(__dirname, '../assets/useravatar.png'));
	res.writeHead(200, { 'Content-Type': 'image/jpeg' });
	return res.end(img, 'binary')
}
const getFeedByPagesIds = async (pagesIds, skip) => {
	let feeds = []
	if (pagesIds.length === 0) {
		feeds = await mongodb.collection('feeds').find({})
			.sort({ date: -1 })
			.skip(parseInt(skip))
			.limit(10)
			.toArray()
	} else {
		feeds = await mongodb.collection('feeds').find({
			idpage: { $in: pagesIds }
		})
			.sort({ date: -1 })
			.skip(parseInt(skip))
			.limit(10)
			.toArray()
	}
	return feeds
}

const getPagesByUser = async (userId, pagesIds, notifications) => {
	return new Promise((_resolve, _reject) => {
		cache('user-pages', userId.toString().toLowerCase()).then(pages => {
			_resolve(pages)
		})
			.catch(async () => {
				_resolve(getPagesByUserMongo(userId, pagesIds, notifications))
			})
	})
}

export const getPagesByUserMongo = async (userId, pagesIds, notifications = []) => {
	let userpages = await mongodb.collection('pages').find({
		$and: [{
			id: { $in: pagesIds }
		}, {
			removed: { $not: { $eq: true } }
		}]
	})
		.project({ id: 1, title: 1, nickname: 1, url: 1 })
		.toArray()
	userpages = userpages.map(page => {
		page.notifications = notifications.filter(n => n.pageId === page.id && n.new).length
		page.miniavatar = BASE_URL + "/image/" + page.url + "/miniavatar"
		return page
	})
	await cache('user-pages', userId.toString().toLowerCase(), userpages, 'inHour')
	return userpages
}

export const setUserNoSuggestions = async ({ user, query }, res) => {
	try {
		const noSuggestions = user.noSuggestions || []
		if (!noSuggestions.includes(query.context)) {
			noSuggestions.push(query.context)
		}
		await setUserField(user._id, 'noSuggestions', noSuggestions)
		res.apiSend()
	} catch (error) {
		res.apiError({ error })
	}
}

export const setUserBlackListSuggestion = async ({ user, body }, res) => {
	try {
		const blackListPages = user.blackListPages || []
		const userBlackList = [...blackListPages, body]
		await setUserField(user._id, 'blackListPages', userBlackList)
		res.apiSend(userBlackList)
	} catch (error) {
		res.apiError({ error })
	}
}

export const setDevice = async ({ user, body }, res) => {
	try {
		const userId = user._id
		const {
			device
		} = body
		await mongodb.collection('users').updateOne({
			_id: ObjectId(userId)
		}, {
				$addToSet: {
					devices: device
				}
			})

		res.apiSend()
	} catch (error) {
		res.apiError({ error })
	}
}

export const setUserField = (userId, field, value) => {
	return mongodb.collection('users').updateOne({ _id: ObjectId(userId) }, { $set: { [field]: value } })
}

async function deleteNotificationsOlderThanOneMonth(userId, notifications) {
	const aMounth = await new Date().getTime() - 2601132156


	notifications = notifications.filter(n => n.timestamp > aMounth)

	notifications = notifications.slice(0, 50)

	await setUserField(userId, 'notifications', notifications)
	return notifications
}
