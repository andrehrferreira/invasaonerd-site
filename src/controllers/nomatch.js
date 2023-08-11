import { mongodb } from '@dekproject/scope'

const BASE_URL = process.env.BASE_URL

export const getSuggestionsPages = async (req, res) => {
  try {
    const { search } = req.params
    if (search) {
      let suggestions = await findSuggestions(search, 0)
      suggestions = suggestions.map(page => {
        return {
          title: page.title,
          url: page.url,
          miniavatar: BASE_URL + "/image/" + page.url + "/miniavatar",
          avatar: BASE_URL + "/image/" + page.url + "/avatar"
        }
      })
      return res.json(
        suggestions
      )
    } else {
      res.status(400).send({ error: 'Search is required' })
    }

  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}


async function findSuggestions(search, index) {
  const suggestions = await mongodb.collection('search')
    .find({
      $text: {
        $search: search.split('-').join(' '),
        $caseSensitive: false,
        $diacriticSensitive: false
      }
    })
    .project({ score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .limit(10)
    .toArray()
  if (suggestions.length === 0 && search !== '' && index < 10) {
    const newSearch = search.split('').filter((letter, index, arr) => index < (arr.length - 1)).join('')
    return await findSuggestions(newSearch, index++)
  } else {
    return suggestions
  }
}