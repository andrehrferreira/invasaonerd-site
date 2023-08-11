import { getLives } from '../controllers/lives'

export default async (router) => {
  router.route('/lives')
      .get(getLives);
}
