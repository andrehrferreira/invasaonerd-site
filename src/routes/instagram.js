
import { getInstagramInfos, getInstagramUserMidia } from '../controllers/instagram'
export default async (router) => {
  router.route('/instagram/info')
    .get(getInstagramInfos)
    
  router.route('/instagram/media')
    .get(getInstagramUserMidia)
}