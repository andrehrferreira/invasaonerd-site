
import { mongodb } from "@dekproject/scope"
const BASE_URL = process.env.BASE_URL
export const searchPageByText = async (req, res) => {
  try {
    const { text } = req.query;
    if (!text) {
      return res.status(400).json({ error: "Query text is required" })
    }
    let query = {};

    if (text.length < 5) {
      query.search = {
        '$regex': text,
        '$options': 'i^'
      }
    } else {
      query.$text = {
        $search: text,
        $caseSensitive: false,
        $diacriticSensitive: false
      }
    }

    let results = await mongodb.collection("search")
      .find(query)
      .project({ score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .toArray()

      results = results.map(page => {
      page.miniavatar = BASE_URL + '/image/' + page.url + '/miniavatar'
      page.avatar = BASE_URL + '/image/' + page.url + '/avatar'
      return page
    })
    res.json(results)

  } catch (error) {
    res.status(500).json({error})
  }
}