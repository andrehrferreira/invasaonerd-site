
import { getBooksBySearch } from '../controllers/books'

export default async (router) => {

  router.route('/books')
    .get(getBooksBySearch)
 
}