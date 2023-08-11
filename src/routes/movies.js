import { getMovies } from '../controllers/movies'

export default async (router) => {
  router.route('/movies')
      .get(getMovies);
}
