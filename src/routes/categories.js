import { getAllCategory } from '../controllers/category'

export default async (router) => {
  router.route('/categories')
    .get( async (req, res) => {
      try {
        const categories = await getAllCategory()
        res.json(categories)
      } catch (error) {
        res.status(500).send()
      }
    })
}