import { getIconWebsite } from '../controllers/website'

export default async (router) => {
  router.route('/website/icon')
    .get(getIconWebsite)
}