import { mongodb } from '@dekproject/scope'
import { cache } from '../core/cache'
const {
  search,
  channels
} = require('googleapis').google.youtube('v3')
import { JSDOM } from 'jsdom'
import request from 'request'
const auth = 'AIzaSyBPjwU4s4dOPIMkRNXXIoCJnP8pxmYN0NU'
const cronjobauth = 'AIzaSyAYRVDyq8PsN7ROKNyBCFF7sGL-jzCtprU'

export const getYoutubeChannel = async (req, res) => {
  try {
    const { search } = req.query;
    if (search) {
      const channels = await YoutubeChannel(search);
      res.json(channels);
    } else {
      res.status(400).send({ error: 'Search is required' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}

export const getYoutubeChannelByType = async (req, res) => {
  try {
    const { search, url, type } = req.query;
    if (search && url) {
      const channel = await YoutubeChannelByType(search, url, type || 'id');
      res.json(channel);
    } else {
      res.status(400).send({ error: 'Search is required' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}



export const getYoutubeVideos = async (req, res) => {
  try {
    const { search } = req.query;
    if (search) {
      const videos = await YoutubeVideos(search);
      res.json(videos);
    } else {
      res.status(400).send({ error: 'Search is required' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}

export const VideosByChannel = async (id, limit) => {
  return new Promise((resolve, reject) => {
    cache('api-yt-videos' + setLimit(limit), id.toLowerCase()).then(videos => {
      resolve(videos);
    }).catch(err => {
      getVideosChannel(id, limit)
        .then(videos => {
          cache('api-yt-videos' + setLimit(limit), id.toLowerCase(), videos, 'inFifteenMinutes');
          resolve(videos);
        })
        .catch(err => {
          reject(err)
        })
    })
  })
}

export const PlaylistByChannel = async (id, limit) => {
  return new Promise((resolve, reject) => {
    cache('api-yt-playlists' + setLimit(limit), id.toLowerCase()).then(playlists => {
      resolve(playlists);
    }).catch(err => {
      getPlayListsChannel(id, limit)
        .then(playlists => {
          cache('api-yt-playlists' + setLimit(limit), id.toLowerCase(), playlists, 'inFifteenMinutes');
          resolve(playlists);
        })
        .catch(err => {
          reject(err)
        });
    });
  })
}

const getVideosChannel = (channelId, limit, cronjob) => {
  return new Promise(async (resolve, reject) => {
    try {

      let channel = await getYoutubeByChannelId(channelId)
      if (!channel) channel = { videos: [] }
      if (channel.videos.length < 20) {
        const videos = await getVideosChannelAPI(channelId, 20 - channel.videos.length, cronjob)
        await saveVideos(channelId, videos)
      } else {
        console.log(channel)
      }
      const { videos } = await getYoutubeByChannelId(channelId)
      resolve(videos)
    } catch (error) {
      reject(error)
    }
  })
}


const getVideosChannelAPI = (channelId, limit, cronjob) => {
  return new Promise((resolve, reject) => {
    search.list({
      auth: cronjob ? cronjobauth : auth,
      part: 'id,snippet',
      type: 'video',
      channelId: channelId,
      maxResults: limit ? parseInt(limit) : 20,
      order: 'date'
    }, (err, response) => {
      if (err) {
        reject({
          message: 'The API returned an error: ' + err,
          status: 500
        })
        return
      }
      const {
        items
      } = response.data
      resolve(items.map(video => {
        return {
          id: video.id.videoId,
          link: "https://www.youtube.com/watch?v=" + video.id.videoId,
          kind: video.id.kind,
          publishedAt: video.snippet.publishedAt,
          channelId: video.snippet.channelId,
          channelTitle: video.snippet.channelTitle,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnails: video.snippet.thumbnails
        }
      }))
    })
  })
}


const YoutubeVideosAPI = (query, limit, cronjob) => {
  return new Promise((resolve, reject) => {
    search.list({
      auth: cronjob ? cronjobauth : auth,
      part: 'id,snippet',
      type: 'video',
      q: query,
      maxResults: limit ? parseInt(limit) : 20,
      order: 'date',
      type: 'video'
    }, (err, response) => {
      if (err) {
        reject({
          message: 'The API returned an error: ' + err,
          status: 500
        })
        return
      }
      const {
        items
      } = response.data
      resolve(items.map(item => {
        return {
          id: item.id.videoId,
          link: "https://www.youtube.com/watch?v=" + item.id.videoId,
          kind: item.id.kind,
          publishedAt: item.snippet.publishedAt,
          channelId: item.snippet.channelId,
          channelTitle: item.snippet.channelTitle,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnails: item.snippet.thumbnails
        }
      }))
    })
  })
}

const getPlayListsChannel = (channelId, limit, cronjob) => {
  return new Promise((resolve, reject) => {
    search.list({
      auth: cronjob ? cronjobauth : auth,
      part: 'id,snippet',
      type: 'playlist',
      channelId: channelId,
      maxResults: limit ? parseInt(limit) : 30,
      order: 'date'
    }, (err, response) => {
      if (err) {
        reject({
          message: 'The API returned an error: ' + err,
          status: 500
        })
        return
      }
      const {
        items
      } = response.data
      resolve(items.map(item => {
        return {
          id: item.id.playlistId,
          link: "https://www.youtube.com/playlist?list=" + item.id.playlistId,
          kind: item.id.kind,
          publishedAt: item.snippet.publishedAt,
          channelId: item.snippet.channelId,
          channelTitle: item.snippet.channelTitle,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnails: item.snippet.thumbnails
        }
      }))
    })
  })
}

const YoutubeChannelAPI = async (query, limit) => {
  return new Promise((resolve, reject) => {
    search.list({
      q: query,
      auth: auth,
      part: 'id,snippet',
      type: 'channel',
      maxResults: limit ? parseInt(limit) : 30,
    }, (err, response) => {
      if (err) {
        reject({
          message: 'The API returned an error: ' + err,
          status: 500
        })
        return
      }
      const {
        items
      } = response.data
      resolve(items.filter(item => item.id !== undefined).map(item => {
        return {
          id: item.id.channelId,
          link: "https://www.youtube.com/channel/" + item.id.channelId,
          kind: item.id.kind,
          publishedAt: item.snippet.publishedAt,
          channelId: item.snippet.channelId,
          channelTitle: item.snippet.channelTitle,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnails: item.snippet.thumbnails
        }
      }))
    })
  })
}
const YoutubeChannelByTypeAPI = async (query, url, type) => {
  const _type = type == 'username' ? 'forUsername' : 'id'
  return new Promise((resolve, reject) => {
    channels.list({
      auth: auth,
      part: 'id,snippet,brandingSettings,contentDetails,invideoPromotion,statistics,topicDetails',
      [_type]: query
    }, (err, response) => {
      if (err) reject(err)
      else callbackChannel(err, response, resolve, reject, url)
    })
  })
}
const YoutubeChannel = async (search, limit = 30) => {
  return new Promise((resolve, reject) => {
    cache('api-yt-channels' + setLimit(limit), search.toLowerCase()).then(channels => {
      resolve(channels);
    }).catch(err => {
      YoutubeChannelAPI(search, limit)
        .then(channels => {
          cache('api-yt-channels' + setLimit(limit), search.toLowerCase(), channels, 'inFifteenMinutes');
          resolve(channels);
        })
        .catch(err => {
          reject(err)
        })
    })
  })
}

const YoutubeChannelByType = async (search, url, type) => {
  return new Promise((resolve, reject) => {
    cache('api-yt-channel', search.toLowerCase()).then(channels => {
      resolve(channels);
    }).catch(err => {
      YoutubeChannelByTypeAPI(search, url, type)
        .then(channels => {
          cache('api-yt-channel', search.toLowerCase(), channels, 'inAday');
          resolve(channels);
        })
        .catch(err => {
          reject(err)
        })
    })
  })
}

export const YoutubeVideos = async (search, limit = 30) => {
  return new Promise((resolve, reject) => {
    cache('api-yt-videos' + setLimit(limit), search.toLowerCase()).then(videos => {
      resolve(videos);
    }).catch(err => {
      YoutubeVideosAPI(search, limit)
        .then(videos => {
          cache('api-yt-videos' + setLimit(limit), search.toLowerCase(), videos, 'inFifteenMinutes');
          resolve(videos);
        })
        .catch(err => {
          reject(err)
        })
    })
  })
}

function callbackChannel(err, response, resolve, reject, url) {
  try {
    if (err) {
      reject({
        message: 'The API returned an error: ' + err,
        status: 500
      })
      return
    }
    const {
      items
    } = response.data

    if (items[0].brandingSettings.channel.featuredChannelsUrls) {
      Promise.all(items[0].brandingSettings.channel.featuredChannelsUrls.map(ftchannel => {
        return new Promise((resolve, reject) => {
          search.list({
            auth: auth,
            part: 'id,snippet',
            type: 'channel',
            channelId: ftchannel
          }, (err, response) => {
            if (err) return resolve([])
            resolve(response.data.items.map(item => {
              return {
                id: item.id.channelId,
                link: "https://www.youtube.com/channel/" + item.id.channelId,
                kind: item.id.kind,
                publishedAt: item.snippet.publishedAt,
                channelId: item.snippet.channelId,
                channelTitle: item.snippet.channelTitle,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnails: item.snippet.thumbnails
              }
            })[0])
          })
        })
      })).then(featuredChannelsUrls => {
        formatOut(items, featuredChannelsUrls, url).then(channel => {
          resolve(channel)
        })
      })
    } else {
      formatOut(items, false, url).then(channel => {
        resolve(channel)
      })
    }
  } catch (error) {
    reject(error)
  }
}

async function formatOut(items, channels, url) {
  const channelInfo = await items.map(ch => {
    return {
      id: ch.id,
      title: ch.snippet.title,
      publishedAt: ch.snippet.publishedAt,
      description: ch.snippet.description,
      avatar: ch.snippet.thumbnails.high.url,
      country: ch.snippet.country,
      statistics: ch.statistics,
      playlistWithAllVideos: ch.contentDetails.relatedPlaylists.uploads,
      keywords: ch.brandingSettings.channel.keywords,
      featuredChannelsTitle: ch.brandingSettings.channel.featuredChannelsTitle,
      featuredChannelsUrls: channels ? channels.filter(ch => ch ? true : false) : ch.brandingSettings.channel.featuredChannelsUrls,
      cover: ch.brandingSettings.image.bannerTvHighImageUrl
    }
  })[0]
  if (url) {
    channelInfo.links = await getYoutubeLinks(url)
  }
  return await new Promise(resolve => {
    resolve(channelInfo)
  })
}

function getYoutubeLinks(url) {
  return new Promise(resolve => {
    request.get({
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
        'From': 'webmaster@example.org'
      }
    }, (err, response, body) => {
      var ytLinks = ''
      try {
        const links = []
        // ytLinks = new JSDOM(body, {
        // 	runScripts: 'dangerously'
        // }).window.ytInitialData.header.c4TabbedHeaderRenderer.headerLinks.channelHeaderLinksRenderer
        // if (ytLinks.primaryLinks) {
        // 	ytLinks.primaryLinks.map(link => {
        // 		links.push({
        // 			type: link.title.simpleText,
        // 			link: link.navigationEndpoint.commandMetadata.webCommandMetadata.url
        // 		})
        // 	})
        // }
        // if (ytLinks.secondaryLinks) {
        // 	ytLinks.secondaryLinks.map(link => {
        // 		links.push({
        // 			type: link.title.simpleText,
        // 			link: link.navigationEndpoint.commandMetadata.webCommandMetadata.url
        // 		})
        // 	})
        // }
        return resolve(links)
      } catch (err) {
        return resolve([])
      }
    })
  })
}

function setLimit(limit) {
  if (limit) return '-limit-' + limit
  return ''
}

async function saveVideos(channelId, videos) {
  let youtubeMongo = await getYoutubeByChannelId(channelId)

  if (!youtubeMongo) {
    youtubeMongo = {
      channelId: videos[0].channelId,
      channelTitle: videos[0].channelTitle,
      videos: []
    }
  }
  delete youtubeMongo._id
  upsertYoutube(channelId, youtubeMongo, videos)
}


function getYoutubeByChannelId(channelId) {
  return mongodb.collection('youtube').findOne({
    channelId
  })
}

async function upsertYoutube(channelId, data, videos) {
  await mongodb.collection('youtube').updateOne({
    channelId
  }, {
      $set: data
    }, {
      upsert: true
    })

  await mongodb.collection('youtube').updateMany({
    channelId
  }, {
      $push: {
        videos: {
          $each: videos
        }
      }
    })
}
