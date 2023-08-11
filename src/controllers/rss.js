import { cache } from '../core/cache'
import Parser from 'rss-parser'

const parser = new Parser()

export const getRss = async (req, res) => {
  try {
    const { url } = req.query;
    if (url) {
      const feeds = await getRssApi(url);
      res.json(feeds);
    } else {
      res.status(400).send({ error: 'Url is required' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}

export const getRssApi = async (url) => {
  return new Promise((resolve, reject) => {
    cache('rss', url).then(feeds => {
      resolve(feeds)
    }).catch(() => {
      parser.parseURL(url).then(feeds => {
        feeds.items = feeds.items.filter((feed, index) => {
          return index < 30
        })
        cache('rss', url, feeds, 'inHour')
        resolve(feeds)
      }).catch(err => {
        reject(err)
      })
    })
  })
}

