import { cache } from '../core/cache'
import { mongodb } from "@dekproject/scope"
import { formatPages } from "./pages"
import { getPagesByUserMongo, setUserField } from "./user"
import { flatArray } from './../utils'

export const getEngementPages = async (req, res) => {

  const pipeline = []
  pipeline.push({ $match: { $and: [{ engagement: true }, { removed: { $ne: true } }] } })
  pipeline.push({ $sample: { size: 78 } })
  pipeline.push({
    $project: {
      avatar: 1,
      miniavatar: 1,
      title: 1,
      nickname: 1,
      id: 1,
      images: 1,
      featuredPages: 1,
      url: 1,
      cover: 1
    }
  })
  try {
    var pages = await mongodb.collection('pages').aggregate(pipeline).toArray()
    res.apiSend({ pages: await formatPages(pages, null, true, true) })
  } catch (error) {
    res.apiError({ error })
  }
}

export const setUserPages = async ({ user, body }, res) => {
  try {
    const setPages = body.finished ? [...user.pages, ...body.pages] : body.pages
    await setUserField(user._id, 'pages', setPages)
    if (body.finished) {
      await setUserField(user._id, 'newuser', false)
    }
    await getPagesByUserMongo(user._id, setPages, user.notifications)
    res.apiSend()
  } catch (error) {
    res.apiError({ error })
  }
}

export const getSuggestions = async ({ user, query }, res) => {
  try {
    const cachePage = query.cachePage ? Number(query.cachePage) : undefined
    const suggestionPages = await getUserSuggestions({ user, firstSelection: true, cachePage })

    res.apiSend({ pages: suggestionPages })

  } catch (error) {
    console.log(error)
    res.apiError({ error })
  }
}

export const getUserSuggestions = async ({ user, firstSelection, cachePage }) => {

  try {
    let aux = 0
    let cachedPages = []
    const blackListPages = user.blackListPages || []
    const userPages = user.pages || []

    while (cachedPages.length < 20) {
      cachedPages = (await cache('user-suggestions', `${user._id}-${cachePage + aux}`)).filter(
        ({ id }) =>
          blackListPages.every(page => page.id !== id) &&
          userPages.every(pageId => pageId !== id)
      )
      aux++
    }
    cachedPages
    return cachedPages
  } catch (error) {

    const allUserPages = await mongodb.collection('pages').find({
      $and: [
        {
          id: {
            $in: user.pages
          },
        },
        { removed: { $ne: true } }
      ]
    }).project({ categories: 1, featuredPages: 1, url: 1 }).toArray()

    const threUserPages = getThreUserPages(allUserPages, firstSelection)

    const results = [[], [], []]
    const callback = searchPages.bind({
      allUserPages,
      firstSelection,
      blackListPages: user.blackListPages || []
    })

    const resultPages = flatArray(await threUserPages.reduce(callback, results))
    const pages = await getPages({ url: { $in: resultPages } })
    const suggestions = await formatPages(pages, null, true, true)

    cache('user-suggestions', `${user._id}-${cachePage}`, suggestions, 'inFiveMinutes')
    return suggestions
  }
}

async function searchPages(result, { categories, featuredPages }, index) {
  result = await result
  if (index === 0) {
    const allFeaturedPages = flatArray(this.allUserPages.map(p => {
      if (p.featuredPages) {
        return p.featuredPages.map(f => f.url)
      }
      return []
    }))
    const commonFeaturedPages = allFeaturedPages.filter((p, i) => allFeaturedPages.indexOf(p) !== i)
    const nonSelectedPages = commonFeaturedPages.filter(commonFeaturedPage => this.allUserPages.every(p => p.url !== commonFeaturedPage))
    result[index] = [...new Set(nonSelectedPages.filter((n, i) => i < 10))]
  }

  if (featuredPages) {
    let flatedResult = flatArray(result)
    featuredPages.forEach(({ url }) => {
      if (
        !flatedResult.includes(url) &&
        result[index].length <= 6 &&
        this.allUserPages.every(p => p.url !== url) &&
        this.blackListPages.every(p => p.url !== url)
      ) {
        result[index].push(url)
      }
    })
  }

  if (result[index].length < 10) {
    let flatedResult = flatArray(result)
    const excludeUrls = [
      ...flatedResult,
      ...this.allUserPages.map(p => p.url),
      ...this.blackListPages.map(p => p.url)
    ]
    result[index] = await getCategoriesPages({
      categories,
      currentPages: result[index],
      excludeUrls: [...new Set(excludeUrls)],
      firstSelection: this.firstSelection
    })
  }

  return result
}

function getThreUserPages(pages, firstSelection) {
  if (firstSelection) {
    return pages.filter((p, i) => i < 3)
  } else {
    return Array.from({ length: 3 }).map(() => pages[Math.floor(Math.random() * pages.length)])
  }
}

async function getCategoriesPages({ categories, currentPages, excludeUrls, firstSelection }) {
  const pipeline = []

  pipeline.push({
    $match: {
      $and: [{
        categories: { $in: categories }
      }, {
        url: { $nin: excludeUrls }
      }]
    }
  })
  if (firstSelection) {

    pipeline.push({ $match: { removed: { $ne: true } } })
    pipeline.push({ $unwind: "$featuredPages" })
    pipeline.push({
      $group: {
        _id: "$_id",
        featuredPages: { $push: "$featuredPages" },
        featuredPagesSize: { $sum: 1 },
        url: { $first: "$url" },
      }
    })
    pipeline.push({ $sort: { featuredPagesSize: -1 } })
  } else {
    pipeline.push({ $project: { url: 1 } })
  }
  pipeline.push({ $limit: 10 - currentPages.length })

  const pages = await mongodb.collection('pages').aggregate(pipeline).toArray()

  const pagesUrls = pages.map(({ url }) => url)
  return [...currentPages, ...pagesUrls]
}

function getPages(query) {
  return mongodb.collection('pages').find(query)
    .project({
      avatar: 1,
      miniavatar: 1,
      title: 1,
      nickname: 1,
      id: 1,
      images: 1,
      featuredPages: 1,
      url: 1,
      cover: 1
    }).toArray()
}
