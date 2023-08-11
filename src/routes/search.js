import { searchPageByText } from '../controllers/search'

export default async (router) => {
  router.route('/search')
    .get(searchPageByText)
}