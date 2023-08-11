
import { getEngementPages, setUserPages, getSuggestions } from '../controllers/new-user'
import { isAuthenticated } from '../controllers/auth'

export default async (router) => {

  router.route('/newuser/engagementpages')
    .all(isAuthenticated())
    .get(getEngementPages)
    .post(setUserPages)

  router.route('/newuser/selectpages')
    .all(isAuthenticated())
    .get(getSuggestions)
}
