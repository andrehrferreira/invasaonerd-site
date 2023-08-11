import { getAvatar, getCover, getMiniAvatar, getPageByImage, getImageByUrl } from '../controllers/images'
import express from 'express'

export default async (router) => {
  const r = express.Router();

  r.get('/cover.jpg', getCover)
  r.get('/avatar.jpg', getAvatar)
  r.get('/miniavatar.jpg', getMiniAvatar)

  r.get('/cover', getCover)
  r.get('/avatar', getAvatar)
  r.get('/miniavatar', getMiniAvatar)


  router.use('/image/:image', r)

  router.use('/image/geturl', getImageByUrl)

  router.param('image', getPageByImage);
}
