import express from 'express'
import { getSerieSearch, getSerieDetails, getSerieSeason } from '../controllers/series'


export default async (router) => {
  
  const r = express.Router();
  
  r.get('/', getSerieSearch)
  r.get('/details/:serieId', getSerieDetails)
  r.get('/season/:serieId', getSerieSeason)

  router.use('/series', r)

}