
import { getFeedbackById, setFeedbackByIdAproved, setFeedbackByIdDiscard, getFeedbackList, getFeedbackByUserPending } from '../controllers/feedback'
import { isAuthenticated } from '../controllers/auth'

export default async (router) => {
  router.route('/feedback/:feedbackId')
    .all(isAuthenticated())
    .get(getFeedbackById)
    .post(setFeedbackByIdDiscard)
    .put(setFeedbackByIdAproved)

  router.route('/feedback')
    .all(isAuthenticated())
    .get(getFeedbackList)
    
  router.route('/feedback/user/:ref')
    .all(isAuthenticated())
    .get(getFeedbackByUserPending)
}