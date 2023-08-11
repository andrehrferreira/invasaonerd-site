import { getWiki } from '../controllers/wiki'

export default async (router) => {
  router.route('/wiki')
      .get(getWiki);

}
