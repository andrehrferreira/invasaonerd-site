import { getRss } from '../controllers/rss'

export default async (router) => {
  router.route('/rss')
    .get(getRss)
}