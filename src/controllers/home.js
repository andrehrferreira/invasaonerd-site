import { getAllCategory } from './category'
import { redisGet, redisKeys } from '../core/cache'
import { formatPage, getPagesByCategory } from './pages'
import { getUserSuggestions } from './new-user'

export const getAllPages = async (req, res) => {
  try {
    const categories = await getAllCategory()
    const keys = await redisKeys('*in-index*')
    let pages = []
    let suggestions = undefined
    const user = {}

    if (keys.length === 0) {
      pages = await getPagesByCategories(categories)
    } else {
      pages = await Promise.all(
        keys.map(async (key) => {
          let page = await redisGet(key)
          page = JSON.parse(page)
          return page
        })
      )
    }
    if (req.user) {
      try {
        suggestions = await getUserSuggestions({ user: req.user, cachePage: 1 })
      } catch (error) {
        //Erro ao buscar as sugestões
      }
      user.blackListPages = req.user.blackListPages || []
      user.noSuggestions = req.user.noSuggestions
      user.pages = req.user.pages || []
    }
    res.json({ pages: pages, pages_size: pages.length, timestamp: new Date(), categories, suggestions, user })
  } catch (error) {
    res.status(500).json(error)
  }
}


const getPagesByCategories = async (categories) => {
  const pages = []
  await Promise.all(categories.map(async (category) => {
    const pg = await getPagesByCategory(category.text)
    return Promise.all(pg.map(async (p) => {
      p = await formatPage(p, categories)

      if (pages.every(_ => _.ref != p.ref))
        pages.push(p)
    }))
  }))
  return pages
}

