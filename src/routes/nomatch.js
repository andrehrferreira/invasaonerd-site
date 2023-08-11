import { getSuggestionsPages } from '../controllers/nomatch'

export default async (router) => {
  router.route('/nomatch/:search')
    .get(getSuggestionsPages)

}