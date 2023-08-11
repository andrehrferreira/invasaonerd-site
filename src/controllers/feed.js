
import { ObjectId } from 'mongodb'
import { mongodb } from '@dekproject/scope'
import gmailSend from '../core/email'
import schema from '../core/schema'

const BASE_URL = process.env.BASE_URL
const PROXY_URL = process.env.PROXY_URL

export const getFeed = async (req, res) => {
	try {

		const { feedId } = req.params

		let feed = await mongodb.collection('feeds').findOne({
			_id: ObjectId(feedId)
		})
		feed.metatags = getMetatags(feed)
		if (feed)
			res.json(feed)
		else
			res.status(404).send({ error: 'FeedId not exists' })
	} catch (error) {
		res.sendStatus(500)
	}
}
export const setReact = async (req, res) => {
	try {
		const { user: { _id } } = req
		const { feedId, like, firstTime } = req.body
		const query = { _id: ObjectId(feedId) }
		let set = {}

		if (firstTime) {
			set = { $set: { likes: [_id] } }
		} else if (like) {
			set = { $push: { likes: _id } }
		} else {
			set = { $pull: { likes: { $in: [_id] } } }
		}

		const { result } = await mongodb.collection('feeds').updateOne(query, set)
		res.send({ status: result.ok })
	} catch (error) {
		res.status(500).send(error)
	}
}

export const setShare = async (req, res) => {
	try {
		const { feedId } = req.body

		const query = { _id: ObjectId(feedId) }
		const set = { $inc: { shares: 1 } }
		const { result } = await mongodb.collection('feeds').updateOne(query, set)

		res.send({ status: result.ok })
	} catch (error) {
		res.status(500).send(error)
	}
}




export const getComment = async (req, res) => {
	try {

		let { feedId, limit, skip, order } = req.query

		if (!feedId) return res.status(400).json({ error: "Query feedId is required" })

		if (!limit) limit = 5
		else limit = parseInt(limit)
		if (!skip) skip = 0
		if (!order) order = 'news'

		const sort = {
			relevance: { likes: 1 },
			news: { timestamp: -1 },
			all: { timestamp: 1 }
		}[order]

		let cursor = mongodb.collection('comments').find({ feedId }).sort(sort)
		if (limit > 0) {
			cursor = cursor.limit(limit)
		}
		if (skip > 0) {
			cursor = cursor.skip(skip)
		}

		let comments = await cursor.toArray()
		comments = comments.filter(c => c.user).map(comment => {
			comment.user.avatar = BASE_URL + "/user/" + comment.user.id + "/useravatar"
			return comment
		})
		res.json(comments)

	} catch (err) {
		res.sendStatus(500)
	}
}

export const setComment = async (req, res) => {
	try {
		const { feedId, comment, quant, commentId } = req.body
		const date = new Date().getTime()
		let finish = {}
		let count = 0
		const commentQuery = { _id: ObjectId(commentId) }

		if (quant !== 0) {

			changeCommentFeedById(feedId, quant)
		}

		if (quant == 1) {
			comment.feedId = feedId
			comment.timestamp = date
			comment.replies = []
			finish = await mongodb.collection('comments').insertOne(comment)
		} else if (quant === -1) {
			const commentList = await mongodb.collection('comments').findOne(commentQuery)
			if (commentList && commentList.replies)
				await changeCommentFeedById(feedId, -commentList.replies.length)
			finish = await mongodb.collection('comments').deleteOne(commentQuery)
			await mongodb.collection('comments').deleteMany({ commentId })
			count = commentList.replies.length + 1
		} else {
			const commentSet = {
				$set: {
					text: comment.text,
					editedtimestamp: date,
					edited: true
				}
			}
			finish = await mongodb.collection('comments').updateOne(commentQuery, commentSet)
		}
		const response = { status: finish.result.ok }
		if (finish.insertedId) {
			response.date = date
			response._id = finish.insertedId.toHexString()
		} else if (finish.modifiedCount) {
			response.editedtimestamp = date
			response.edited = true
			response._id = commentId
		}
		response.count = count
		res.send(response)
	} catch (error) {
		res.sendStatus(500)
	}
}


export const setReply = async (req, res) => {
	try {
		let { feedId, commentId, comment, replyId, quant } = req.body
		const date = new Date().getTime()
		let count = 0
		let finish = {}
		if (quant == 0) {
			finish = await mongodb.collection('comments').updateOne(
				{
					_id: ObjectId(replyId)
				},
				{
					$set: {
						text: comment.text,
						editedtimestamp: date,
						edited: true
					}
				})

		} else if (quant === -1) {
			finish = await mongodb.collection('comments').deleteOne(
				{
					_id: ObjectId(replyId)
				}
			)
			count = 1
		} else if (quant === 1) {
			comment.commentId = commentId
			delete comment.feedId
			comment.timestamp = date
			finish = await mongodb.collection('comments').insertOne(comment)
		}

		const response = { status: finish.result.ok }
		if (finish.insertedId) {
			response.date = date
			response._id = finish.insertedId.toHexString()
		} else if (finish.modifiedCount) {
			response.editedtimestamp = date
			response.edited = true
			response._id = replyId
		}
		response.count = count

		if (quant !== 0) {
			let set = {}

			if (quant == 1)
				set = { $push: { replies: response._id } }
			else
				set = { $pull: { replies: { $in: [replyId] } } }


			const commentQuery = { _id: ObjectId(commentId) }
			await mongodb.collection('comments').updateOne(commentQuery, set)

			changeCommentFeedById(feedId, quant)
		}

		res.send(response)

	} catch (error) {
		res.sendStatus(500)
	}
}


export const getCommentReplies = async (req, res) => {
	try {

		let { commentId } = req.query

		if (!commentId) return res.status(400).json({ error: "Query commentId is required" })


		const comment = await mongodb.collection('comments').findOne({ _id: ObjectId(commentId) })

		if (!comment) return res.status(404).json({ error: "Comment not exists" })

		const replies = comment.replies.map(r => ObjectId(r))
		let comments = await mongodb.collection('comments').find({
			_id: { $in: replies }
		})
			.sort({ timestamp: 1 })
			.toArray()

		comments = comments.filter(c => c.user).map(comment => {
			comment.user.avatar = BASE_URL + "/user/" + comment.user.id + "/useravatar"
			if (comment.replies) {
				comment.replies = comment.replies.filter(c => c.user).map(reply => {
					reply.user.avatar = BASE_URL + "/user/" + comment.user.id + "/useravatar"
					return reply
				})
			}
			return comment
		})
		res.json(comments)

	} catch (err) {
		res.sendStatus(500)
	}
}

export const reportComment = async (req, res) => {
	try {
		const { report } = req.body
		const { email } = req.user
		const { comment } = report

		const html = `<h1>Denuncia de comentário</h1>
			<p>
				O usuário <b>${email}</b> denunciou o seguinte comentário do usuário <b>${comment.user.name}</b> (${comment.user.id}) <br>
				Data: ${new Date().toLocaleString()} <br>
				Categoria de Denuncia: ${report.categorie}
			</p>
			<p>
				Descrição da denuncia: <b><i>${report.text}</i></b>
			</p>
			<p>
				Comentário denunciado: <b><i>${comment.text}</i></b>
			</p>
			<p>
				<a href="${PROXY_URL}/post/${comment.feedId}" target="_blank"  rel="noopener">
					VISUALIZAR
				</a>
			</p>
		`

		await gmailSend.sendMail({
			to: schema.email.adminEmails,
			from: schema.email.user,
			subject: schema.email.subjects.report + ': ' + report.categorie,
			html
		})
		res.sendStatus(200)
	} catch (err) {
		res.sendStatus(500)
	}

}

async function changeCommentFeedById(feedId, val) {
	await mongodb.collection('feeds').updateOne(
		{
			_id: ObjectId(feedId)
		},
		{
			$inc: { commentsCount: val }
		}
	)
}


const getMetatags = (feed) => {
	let meta = {}
	const { payload } = feed
	if (feed.type == 'youtube-video') {
		const { high } = payload.thumbnails
		meta = {
			title: payload.title,
			image: Object.assign(high, { type: 'image/jpeg' })
		}
	} else {
		const image = payload.thumbnail_resources[3]
		meta = {
			title: `${feed.feeder.title} - Publicação no Instagram`,
			image: {
				url: image.src,
				width: image.config_width,
				height: image.config_height,
				type: 'image/jpeg'
			}
		}
	}
	meta.facebook = [
		'type',
		'title',
		'locale',
		'site_name',
		'article',
		'image',
		'app_id',
		'url'
	]

	meta.twitter = [
		'card',
		'title',
		'image'
	]

	meta.seo = [
		'title'
	]

	meta.card = 'summary_large_image'



	meta.type = 'article'
	meta.locale = 'pt_BR'
	meta.site_name = 'Invasão Nerd'
	meta.app_id = '288306328656111'
	meta.url = PROXY_URL + '/post/' + feed._id

	return meta
}

// export const setComment = async (req, res) => {
// 	try {
// 		const { feedId, comment, quant } = req.body

// 		if (quant !== 0) {
// 			const feedQuery = { _id: objectId(feedId) }
// 			var feedSet = { $inc: { commentsCount: quant } }
// 			await mongodb.collection('feeds').updateOne(feedQuery, feedSet)
// 		}

// 		const commentQuery = { _id: objectId(comment._id) }

// 		var finish = {}
// 		const date = new Date().getTime()
// 		if (quant === 1) {
// 			comment.timestamp = date
// 			finish = await mongodb.collection('comments').insertOne(comment)
// 			if (finish.result.ok && comment.isReply) {
// 				//TODO 
// 				/*notify.user(comment.reply.user.id, {
// 					new: true,
// 					clicked: false,
// 					href: `${settings.url}/post/${feedId}`,
// 					image: `/image/${comment.user.id}/useravatar.jpg`,
// 					message: `${comment.user.name} respondeu a um comentário seu`,
// 					category: 'post-comment',
// 					timestamp: new Date().getTime()
// 				}, mongodb, schema, socket)*/
// 			}
// 		} else if (quant === -1) {
// 			finish = await mongodb.collection('comments').deleteOne(commentQuery)
// 		} else {
// 			comment.editedtimestamp = date
// 			comment.edited = true
// 			const commentSet = {
// 				$set: {
// 					text: comment.text,
// 					editedtimestamp: comment.editedtimestamp,
// 					edited: comment.edited
// 				}
// 			}
// 			finish = await mongodb.collection('comments').updateOne(commentQuery, commentSet)
// 		}

// 		const response = { status: finish.result.ok }
// 		if (finish.insertedId) {
// 			response.date = date
// 			response._id = finish.insertedId.toHexString()
// 		} else if (finish.modifiedCount) {
// 			response.editedtimestamp = date
// 			response.edited = true
// 		}
// 		// socket.emit(`feed-comment-${feedId}`, { response, quant, comment, body: req.body })
// 		res.send(response)
// 	} catch (error) {
// 		res.sendStatus(500)
// 	}
// }

