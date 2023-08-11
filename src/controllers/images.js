import { cache } from '../core/cache'
import { mongodb } from '@dekproject/scope'
import path from 'path'
import fs from 'fs'
import { getInfosPages } from './pages';
const i2b = require("imageurl-base64");

export const getCover = (req, res) => {
  const { page } = req;
  let img = null;
  if (page && page.cover) {
    img = new Buffer.from(page.cover.replace("data:image/jpeg;base64,", ""), 'base64')
  } else {
    img = fs.readFileSync(path.resolve(__dirname, '../assets/default_cover.jpg'));
  }
  res.writeHead(200, {
    'Content-Type': 'image/jpeg',
    'Content-Length': img.length
  })
  return res.end(img, 'binary');
}

export const getAvatar = (req, res) => {
  const { page } = req;
  let img = null;
  if (page && page.avatar) {
    img = new Buffer.from(page.avatar.replace("data:image/jpeg;base64,", ""), 'base64')
  } else {
    img = fs.readFileSync(path.resolve(__dirname, '../assets/avatardefault.jpeg'));
  }
  res.writeHead(200, {
    'Content-Type': 'image/jpeg',
    'Content-Length': img.length
  })
  return res.end(img, 'binary');
}


export const getMiniAvatar = (req, res) => {
  const { page } = req;
  let img = null;
  if (page && page.miniavatar) {
    img = new Buffer.from(page.miniavatar.replace("data:image/jpeg;base64,", ""), 'base64')
  } else {
    img = fs.readFileSync(path.resolve(__dirname, '../assets/avatardefault.jpeg'));
  }
  res.writeHead(200, {
    'Content-Type': 'image/jpeg',
    'Content-Length': img.length
  })
  return res.end(img, 'binary');
}

export const getPageByImage = async (req, res, next, url) => {
  try {
    const page = await getPageByRefFn(url)
    req.page = page;
    next();
  } catch (error) {
    res.status(500).send()
  }
}
const getPageByRefFn = async (url) => {
  return new Promise((resolve, reject) => {
    cache("images", decodeURI(url)).then((page) => {
      resolve(page)
    }).catch(async () => {
      try {
        let page = await mongodb.collection('pages').findOne({
          $and: [{
            removed: {
              $not: {
                $eq: true
              }
            }
          }, {
            url: decodeURI(url)
          }]
        });
        if (page) {

          page = await getInfosPages(page)
          await cache("page", page.url, page, 'inHour')
          await cache('images', page.url, {
            miniavatar: page.miniavatar,
            avatar: page.avatar,
            cover: page.cover,
          }, 'inFiveMinutes')

        }
        resolve(page)
      } catch (error) {
        reject(error)
      }
    })
  })
}

export const getImageByUrl = async (req, res) => {
  try {
    const { url } = req.query;
    if (url) {
      i2b(url, function (error, body) {
        if (error) {
          res.status(500).send(error)
        }
        else {
          res.send(body.dataUri);
        }
      })
    } else {
      res.status(400).send({ error: 'Url is required' })
    }
  } catch (error) {
    res.status(500).send({ error })
  }

}