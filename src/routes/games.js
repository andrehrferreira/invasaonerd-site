import { getGames } from '../controllers/games'

export default async (router) => {
  router.route('/games')
      .get(getGames);
}
