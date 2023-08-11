
import books from 'google-books-search-2'
import { cache } from '../core/cache'
import { mongodb } from '@dekproject/scope'

export const getBooksBySearch = async (req, res) => {
  try {
    const { search } = req.query;
    if (search) {
      cache('api-books', search.toLowerCase()).then((books) => {
        res.json(books)
      }).catch(async () => {
        try {
          let data = await books.search(search, {
            type: 'books',
            lang: 'pt-br',
            limit: 30
          })
          data = data.map(book => {
            if (book.authors)
              book.authors = book.authors.join(", ")
            return book
          });

          cache('api-books', search.toLowerCase(), data, 'inAday');

          //Gravando resultados de API
          data.forEach(d => {
            d.name = d.title
            d.search = search
            mongodb.collection('api-books').updateOne({ name: d.title }, { $set: d }, { upsert: true })
          });

          res.send(data)
        } catch (error) {
          res.status(500).send(error)
        }
      })
    } else {
      res.status(400).send({ error: 'Search is required' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}