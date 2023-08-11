
import { cache } from '../core/cache'
import request from 'request'
import jsdom from 'jsdom'
export const getInstagramInfos = async (req, res) => {
  try {
    const { link } = req.query
    let userInfo = {}
    try {
      userInfo = await cache('instagram', link)
    } catch (err) {
      userInfo = await getInstagramInfosFn(link)
      await cache('instagram', link, userInfo, 'inHour')
    }
    res.json(userInfo)
  } catch (error) {
    res.status(500).send(error)
  }

}
export const getInstagramUserMidia = async (req, res) => {
  try {
    const { link } = await req.query
    let midiaInfo = {}
    try {
      midiaInfo = await cache('instagram-midia', link)
    } catch (err) {
      midiaInfo = await getInstagramUserMidiaFn('https://www.instagram.com/p/' + link + '/')
      cache('instagram-midia', link, midiaInfo, 'inHalfHour')
    }
    midiaInfo = formatMedia(midiaInfo)
    res.send(midiaInfo)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const getInstagramInfosFn = (link) => {
  return new Promise(async (resolve, reject) => {
    try {
      let instagram = await getInstagramByUrl(link)
      if (!instagram) instagram = await getInstagramInfosFnAPI(link)
      resolve(instagram)
    } catch (error) {
      reject(error)
    }
  })
}


export const getInstagramInfosFnAPI = (link) => {
  return new Promise((resolve, reject) => {
    const { JSDOM } = jsdom
    request.get({
      url: link,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
        'From': 'webmaster@example.org'
      }
    }, async (err, response, body) => {
      if (!err) {
        try {
          const site = await new JSDOM(body, {
            runScripts: 'dangerously'
          })
          if (site.window.__initialData.data) {
            const instagram = await site.window.__initialData.data.entry_data.ProfilePage[0].graphql.user
            return resolve(formatInstagram(instagram))
          } else if (body.includes('Restricted profile &bull; Instagram')) {
            return resolve({ blocked: true })
          }
          resolve({ notexist: true })
        } catch (err) {
          return reject(err)
        }
      } else {
        return reject(err)
      }
    })
  })
}

const getInstagramUserMidiaFn = (url) => {
  return new Promise(resolve => {
    const { JSDOM } = jsdom
    request.get({
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
        'From': 'webmaster@example.org'
      }
    }, (err, response, body) => {
      try {
        return resolve(new JSDOM(body, {
          runScripts: 'dangerously'
        }).window.__initialData.data.entry_data.PostPage[0].graphql.shortcode_media)
      } catch (err) {
        return resolve({})
      }
    })
  })
}

const formatMedia = (media) => {
  const data = {}
  data.type = media.__typename
  data.owner = media.owner
  data.display_url = media.display_url
  data.accessibility_caption = media.accessibility_caption


  if (media.edge_media_to_caption[0]) {
    const { node: { text } } = media.edge_media_to_caption.edges[0]
    data.caption = text
  }

  if (media.edge_media_to_parent_comment) {
    const { edges } = media.edge_media_to_parent_comment;
    if (edges) {
      data.comment = edges.map(({ node: { owner, text } }) => ({ owner, text }))
    }
  }
  switch (data.type) {
    case 'GraphVideo':
      data.video_url = media.video_url
      break;
    case 'GraphSidecar':
      const { edges } = media.edge_sidecar_to_children;
      if (edges) {
        data.sidecar = edges.map(({ node: { accessibility_caption, display_url } }) => ({ display_url, accessibility_caption }))
      }
      break;
    default:
      break;
  }


  media.data = data;
  return data;
}
const formatInstagram = (media) => {
  const data = {}
  data.id = media.id
  data.type = media.__typename
  data.profile_pic_url = media.profile_pic_url
  data.username = media.username
  data.full_name = media.full_name
  data.external_url = media.external_url
  data.biography = media.biography
  data.is_private = media.is_private


  if (media.edge_owner_to_timeline_media) {
    const { edges } = media.edge_owner_to_timeline_media;
    if (edges) {
      data.timeline = edges.map(({ node: { shortcode, thumbnail_resources, accessibility_caption, edge_liked_by, edge_media_to_comment } }) => ({ shortcode, edge_liked_by, thumbnail_resources, accessibility_caption, edge_media_to_comment }))
    }
    data.posts = media.edge_owner_to_timeline_media.count
  }

  if (media.edge_followed_by) {
    data.followed = media.edge_followed_by.count
  }

  if (media.edge_follow) {
    data.follow = media.edge_follow.count
  }

  switch (data.type) {
    case 'GraphVideo':
      data.video_url = media.video_url
      break;
    case 'GraphSidecar':
      const { edges } = media.edge_sidecar_to_children;
      if (edges) {
        data.sidecar = edges.map(({ node: { accessibility_caption, display_url } }) => ({ display_url, accessibility_caption }))
      }
      break;
    default:
      break;
  }


  media.data = data;
  return data;
}


function getInstagramByUrl(url) {
  return mongodb.collection('instagram').findOne({
    url
  })
}

