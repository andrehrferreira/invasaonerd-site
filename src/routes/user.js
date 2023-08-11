import {
  getAvatarByUserId,
  getFeeds,
  getNotifications,
  getPages,
  setNotifications,
  setPagesFollowByUserId,
  setUserBlackListSuggestion,
  setUserNoSuggestions,
  setNotificationsByPageId,
  setDevice,
} from '../controllers/user'
import { getSuggestions } from '../controllers/new-user'

import { isAuthenticated } from '../controllers/auth'
export default async (router) => {

  router.route('/user/pages')
    .all(isAuthenticated())
    .get(getPages)

  router.route('/user/feeds')
    .all(isAuthenticated())
    .get(getFeeds)

  router.route('/user/notifications')
    .all(isAuthenticated())
    .get(getNotifications)
    .post(setNotifications)
  
  router.route('/user/notifications/:pageId')
    .all(isAuthenticated())
    .post(setNotificationsByPageId)

  router.route('/user/follow')
    .all(isAuthenticated())
    .post(setPagesFollowByUserId)

  router.route('/user/:userId/useravatar')
    .get(getAvatarByUserId)

  router.route('/user/suggestion')
    .all(isAuthenticated())
    .post(setUserNoSuggestions)

  router.route('/user/blacklistpage')
    .all(isAuthenticated())
    .post(setUserBlackListSuggestion)

  router.route('/user/suggestions')
    .all(isAuthenticated())
    .get(getSuggestions)
  
  router.route('/user/devices')
    .all(isAuthenticated())
    .post(setDevice)
}
