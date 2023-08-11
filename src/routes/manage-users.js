import { getUsersList, getUser, setUser } from '../controllers/manage-users'

import { isAuthenticated } from '../controllers/auth'

export default async (router) => {
  router.route('/manage-users')
    .all(isAuthenticated())
    .get(getUsersList)


  router.route('/manage-users/:userId')
    .all(isAuthenticated())
    .get(getUser)
    .put(setUser)
}