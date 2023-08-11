import { setReact, setShare, getComment, setComment, setReply, getCommentReplies, reportComment, getFeed } from '../controllers/feed'
import { isAuthenticated } from '../controllers/auth'

export default async (router) => {
  router.route('/feed/post/:feedId')
    .get(getFeed)
  
  router.route('/feed/react')
    .all(isAuthenticated())
    .post(setReact)

  router.route('/feed/share')
    .all(isAuthenticated())
    .post(setShare)

  router.route('/feed/comment')
    .get(getComment)
    .all(isAuthenticated())
    .post(setComment)
  
  router.route('/feed/comment/reply')
    .get(getCommentReplies)
    .all(isAuthenticated())
    .post(setReply)
  
  router.route('/feed/comment/report')
    .all(isAuthenticated())
    .post(reportComment)
}