import express from 'express'
import { routineUploadImagesS3 } from '../routines/images'
export default async (router) => {
  const r = express.Router();

  r.get('/uploadimages3', routineUploadImagesS3)

  router.use('/routines', r)

}