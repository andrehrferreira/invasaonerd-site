
import { cache } from '../core/cache'
import { mongodb } from "@dekproject/scope"
import { getCategoryByText } from './category'
import { PlaylistByChannel, VideosByChannel, YoutubeVideos } from './youtube'
import { getLivesAPI } from './lives'
import { SerieDetail } from './series'
import { getRssApi } from './rss'
import { getInstagramInfosFn } from './instagram';

export const getPageByCategory = async (req, res) => {
  try {
    let {
      limit,
      skip,
      category
    } = req.query
    limit = parseInt(limit || 10)
    skip = parseInt(skip || 0)

    let pages = []
    if (category) {
      pages = await getPagesByCategory(category, skip, limit)
      pages = await Promise.all(pages.map(async page => await formatPage(page, null, true, true)))
    }
    res.json({ pages: pages, size: pages.length, hasNext: pages.length === limit })
  } catch (error) {
    res.status(500).json(error)
  }
}

export const getPagesByRef = async (req, res, next, url) => {
  try {
    const page = await getPageByRefFn(url)
    req.page = page;
    next();
  } catch (error) {
    res.status(500).send({ error })
  }
}

export const getPageByUrl = async (req, res) => {
  let { params: { url }, page } = req

  url = decodeURI(url).toLowerCase()
  if (page) {
    if (!page.removed) {
      let order = { void: true }
      const category = await getCategoryByText(page.categories[0])
      if (category && category.order) order = category.order
      await cache('page', page.url, page, 'inFiveMinutes')
      return res.json({
        page: await formatPage(page, [], true, true),
        order,
        timestamp: new Date()
      })
    } else {
      cache("page", url, false, false, 'delete')
    }
  }
  else res.status(404).send()
}

export const getPageByRef = async (req, res) => {
  let { params: { ref } } = req
  const page = await getPageByRefMongo(parseInt(ref), 'ref')
  if (page) {
    if (!page.removed) {
      let order = { void: true }
      const category = await getCategoryByText(page.categories[0])
      if (category && category.order) order = category.order
      return res.json({
        page: await formatPage(page, [], true, true),
        order,
        timestamp: new Date()
      })
    }
  }
  else res.status(404).send()
}

export const checkPage = async (req, res) => {
  const { title, nickname, englishTitle } = req.body
  let query = [];
  let page = null;
  if (title || nickname || englishTitle) {
    if (englishTitle) query.push({ englishTitle: new RegExp(["^", englishTitle, "$"].join(""), "i") })
    if (nickname) query.push({ nickname: new RegExp(["^", nickname, "$"].join(""), "i") })
    if (title) query.push({ title: new RegExp(["^", title, "$"].join(""), "i") })
    page = await mongodb.collection("pages").findOne({
      removed: { $not: { $eq: true } },
      $or: query
    })

  }
  res.json({
    title: page ? new RegExp(["^", englishTitle, "$"].join(""), "i").test(page.title) : false,
    nickname: page ? new RegExp(["^", englishTitle, "$"].join(""), "i").test(page.nickname) : false,
    englishTitle: page ? new RegExp(["^", englishTitle, "$"].join(""), "i").test(page.englishTitle) : false
  })
}

export const getFeaturedPages = async (req, res) => {
  try {
    const { featuredPages } = req.body
    const pages = await getFeaturedPagesMongo(featuredPages)
    res.json(pages)
  } catch (err) {
    res.apiError(err.message)
  }
}

export const getFeaturedPagesMongo = async (featuredPages, isCache = true) => {
  return await Promise.all((featuredPages || []).map(({ url, title }) => {
    return new Promise(async resolve => {
      try {
        let page = await getPageByRefFn(url, isCache)
        if (page) {
          page = await formatPage(page, [], true, true)
          resolve({
            pageId: page._id,
            title: page.title,
            url: page.url,
            avatar: page.avatar,
            miniavatar: page.miniavatar
          })
        } else throw new Error()
      } catch (error) {
        resolve({
          url,
          title,
          error: true
        })
      }
    })
  }))
}

export const sendRevision = async (req, res) => {
  try {
    let { page } = req.body
    if (page) {
      page.categories = page.categories.map(category => {
        if (typeof category == 'string') return category
        else if (category.text) return category.text
      })
      let dataSet = Object.assign({}, page, {
        editRef: page.ref + '-' + page.user.id,
        editDate: new Date().getTime(),
        status: 'pending'
      })
      const pageId = page._id
      delete dataSet._id
      dataSet.pageId = pageId

      const revision = await mongodb.collection('revisions').findOne({
        editRef: dataSet.editRef,
        status: dataSet.status
      })
      if (revision) {
        revision.changes.map(change => {
          if (Object.keys(change).length) {
            dataSet.changes.push(change)
          }
        })
      }
      await mongodb.collection('revisions')
        .updateOne({
          editRef: dataSet.editRef,
          status: dataSet.status
        }, {
            $set: dataSet
          }, {
            upsert: true
          })
      const feedback = await mongodb.collection('revisions').findOne({
        editRef: dataSet.editRef,
        status: 'pending'
      })
      return res.json(feedback)
    } else {
      res.status(400).send({ error: 'Page is required' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}

const BASE_URL = process.env.BASE_URL
const PROXY_URL = process.env.PROXY_URL

export const formatPages = (pages, categories, noCheckCategories, notSaveIndex) => {
  return Promise.all(pages.map(async page => await formatPage(page, categories, noCheckCategories, notSaveIndex)))
}

export const formatPage = async (page, categories, noCheckCategories, notSaveIndex) => {
  if (typeof page === 'string') { page = JSON.parse(page) }

  await cache('images', page.url, {
    miniavatar: page.miniavatar,
    avatar: page.avatar,
    cover: page.cover,
  }, 'inFiveMinutes')

  if (page.website && page.website.icon && page.website.icon.includes("/assets/img/avatardefault.jpeg")) {
    page.website.icon = "/img/avatardefault.jpeg"
  }
  page.nickname = page.nickname ? page.nickname : ''

  if (!noCheckCategories)
    page.categories = checkCategories(categories, page.categories)
  page.summary = getSumary(page.wiki)

  page = parseImages(page)

  if (!notSaveIndex)
    await cache('index', page.url, page, 'inFiveMinutes')

  return page
}

export const parseImages = (page) => {
  const { miniavatar, avatar, cover, minicover } = page;
  page.miniavatar = miniavatar ? BASE_URL + "/image/" + page.url + "/miniavatar" : PROXY_URL + '/img/avatardefault.jpeg'
  page.avatar = avatar ? BASE_URL + "/image/" + page.url + "/avatar" : PROXY_URL + '/img/avatardefault.jpeg'
  page.cover = cover ? BASE_URL + "/image/" + page.url + "/cover" : PROXY_URL + '/img/default_cover.jpg'
  page.minicover = minicover ? minicover : PROXY_URL + '/img/default_cover.jpg'
  return page
}
export const getPagesByCategory = async (category, skip, limit) => {
  const pages = await mongodb.collection('pages').find({
    $and: [{
      removed: {
        $not: {
          $eq: true
        }
      }
    }, {
      categories: { $in: [category] }
    },
    {
      avatar: {
        $exists: {
          $eq: true
        }
      }
    }
    ]
  })
    .project({
      avatar: 1,
      miniavatar: 1,
      cover: 1,
      ref: 1,
      feedbackDate: 1,
      title: 1,
      nickname: 1,
      categories: 1,
      wiki: 1,
      url: 1,
      id: 1,
      images: 1
    })
    .sort({
      feedbackDate: -1
    })
    .skip(skip || 0)
    .limit(limit || 10)
    .toArray()
  return pages
}

function getSumary(wiki) {
  if (wiki) if (wiki.summary) return wiki.summary
  else return ''
}

function checkCategories(categories, pageCategories) {
  if (pageCategories) {
    if (categories.some(cat => pageCategories.includes(cat.text))) {
      return pageCategories
    }
  }
  return ['Sem Categoria']
}

const getPageByRefFn = async (url, isCache = true) => {

  return new Promise((resolve, reject) => {

    cache("page", decodeURI(url)).then(async (page) => {
      if (!isCache) throw new Error()
      if (page.instagram && page.instagram.url && !page.instagram.infos) {
        const { url } = page.instagram
        page.instagram = {
          url: url,
          infos: await getInstagramInfos(url)
        }
      }
      resolve(page)
    }).catch(async () => {
      try {
        const page = await getPageByRefMongo(decodeURI(url))
        resolve(page)
      } catch (error) {
        reject(error)
      }
    })
  })
}

export const getPageByRefMongo = async (value, key = 'url', saveCache = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      let page = await mongodb.collection('pages').findOne({
        $and: [{
          removed: {
            $not: {
              $eq: true
            }
          }
        }, {
          [key]: value
        }]
      });
      if (page)
        page = await getInfosPages(page)
      if (page && saveCache) await cache("page", page.url, page, 'inHour')
      resolve(page)
    } catch (error) {
      reject(error)
    }
  })
}

export const getInfosPages = async (page) => {
  if (page.instagram && page.instagram.url) {
    const { url } = page.instagram
    page.instagram = {
      url: url,
      infos: await getInstagramInfos(url)
    }
  }
  const { videos, playlists } = await getVideosYoutube(page.youtube, page.videos, page.playlists, page.categories)
  if (page.lives) {
    page.streams = await getLives(page.lives)
  }
  if (page.series && page.series.length) {
    page.series = await getDetailsbySeries(page.series)
    page.series = page.series.filter(item => {
      return item.poster_path
    }).map(item => {
      const [day, mounth, year] = item.first_air_date.split('/')
      const datestr = [mounth, day, year].join('/')
      item.date = new Date(datestr)
      item.date = item.date instanceof Date && !isNaN(item.date) ? item.date.getTime() : null
      return item
    }).sort((a, b) => b.date - a.date)
  }

  if (page.movies && page.movies.length) {
    page.movies = await getTrailerYoutube(page.movies)
    page.movies = page.movies.filter(item => item.poster_path && item.backdrop_path
    ).map(item => {
      const [day, mounth, year] = item.release_date.split('/')
      const datestr = [mounth, day, year].join('/')
      item.date = new Date(datestr)
      item.date = item.date instanceof Date && !isNaN(item.date) ? item.date.getTime() : null
      return item
    }).sort((a, b) => b.date - a.date)
  }

  if (page.feeds) {
    page.feedsList = await getFeed(page.feeds)
  }

  if (page.books) {
    page.books = page.books.filter(book => {
      return book.thumbnail
    }).sort((a, b) => parseInt(b.publishedDate) - parseInt(a.publishedDate))
  }

  if (page.games) {
    page.games = page.games.filter(game => {
      return game.url || (game.cover && game.cover.url)
    }).sort((a, b) => b.first_release_date - a.first_release_date)
  }

  page.videos = videos;
  page.playlists = playlists;

  page.metatags = await getMetagas(page)
  return page
}

const getVideosYoutube = async (youtube, hasVideos, hasPlaylists, categories) => {
  let videos = []
  let playlists = []
  if (youtube && youtube.config && youtube.statistics && youtube.statistics.videoCount > 0) {
    const { id, config } = youtube;
    if (hasVideos != null || categories.includes('Youtuber'))
      videos = await VideosByChannel(id, config ? config.limits.videos : 20)
    if (hasPlaylists != null || categories.includes('Youtuber'))
      playlists = await PlaylistByChannel(id, config ? config.limits.playlists : 20)
  }
  return {
    videos,
    playlists
  };
}

const getLives = async (live) => {
  try {
    return await getLivesAPI(live)
  } catch (error) {
    return []
  }
}

const getFeed = async (live) => {
  try {
    return await getRssApi(live)
  } catch (error) {
    return []
  }
}

const getTrailerYoutube = async (movies) => {
  try {
    return await Promise.all(movies.map(async movie => {
      movie.traillers = await YoutubeVideos(`trailer ${movie.original_title}`, 3)
      return movie
    }))
  } catch (error) {
    return movies.map(movie => {
      movie.traillers = []
      return movie
    })
  }
}

const getDetailsbySeries = async (series) => {
  return await Promise.all(series.map(async serie => {
    try {
      serie.details = await SerieDetail(serie.id.toString())
      return serie
    } catch (error) {
      return serie
    }
  }))
}

const getInstagramInfos = async (url) => {
  try {
    return await getInstagramInfosFn(url)
  } catch (error) {
    return {}
  }
}

export const getMetagas = async (page, collection) => {
  let meta = page.seo
  if (collection == 'search' || page.seo == null) {
    meta = await mongodb.collection('search')
      .findOne({
        url: page.url
      })
    if(!meta) meta = page.seo || {}
    
    meta.description = (getSumary(page.wiki) || '').split(`'`).join(``).split(`"`).join(``)
    meta.keywords = meta.search
    if (!meta) {
      await saveSearchIndex(page)
      return getMetagas(page)
    }
  } else if (page.seo) {
    meta.description = page.seo.description
    meta.keywords = page.seo.keywords.join(', ')
  }

  meta.facebook = [
    'type',
    'title',
    'description',
    'locale',
    'site_name',
    'article',
    'image',
    'app_id'
  ]

  meta.twitter = [
    'card',
    'title',
    'description',
    'image'
  ]

  meta.seo = [
    'title',
    'keywords',
    'description'
  ]

  meta.card = 'summary_large_image'



  meta.type = 'article'
  meta.locale = 'pt_BR'
  meta.site_name = 'Invasão Nerd'
  meta.article = {
    section: page.categories.join(", "),
    tag: meta.search,
  }
  meta.app_id = '288306328656111'
  meta.url = PROXY_URL + '/page/' + page.url
  page = parseImages(Object.assign({}, page))

  meta.image = page.avatar

  meta.images = [
    {
      height: 200,
      width: 200,
      url: page.avatar,
      type: 'image/jpeg'
    },
    {
      height: 600,
      width: 800,
      url: page.cover,
      type: 'image/jpeg'
    },
  ]
  return meta
}
