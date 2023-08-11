
import { cache } from '../core/cache'
import { mongodb } from "@dekproject/scope"
import Crawler from 'crawler'
import requestPromise from 'request-promise'

const movieApi = {
  urlSearch: 'https://api.themoviedb.org/3/search/tv',
  urlDetails: 'https://api.themoviedb.org/3/tv/',
  appKey: '?api_key=f1c8ddd206d8543fac2ff357ceaa9b39&query=',
  language: '&language=pt-BR',
  imageInclude: '&append_to_response=images&include_image_language=pt-BR,null'
}
const crawler = new Crawler({ maxConnections: 10 })

export const getSerieSearch = async (req, res) => {
  try {
    const { search } = req.query;
    if (search) {
      const series = await SearchSerie(search);
      res.json(series);
    } else {
      res.status(400).send({ error: 'Search is required' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}

export const getSerieDetails = async (req, res) => {
  try {
    const { serieId } = req.params;
    if (serieId) {
      const serie = await SerieDetail(serieId);
      res.json(serie);
    } else {
      res.status(400).send({ error: 'SerieId is required' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}
export const getSerieSeason = async (req, res) => {
  try {
    const { serieId } = req.params;
    const { season } = req.query;
    if (serieId && season) {
      const serie = await SerieSeason(serieId, season);
      res.json(serie);
    } else {
      res.status(400).send({ error: 'SerieId is required' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}

export const SearchSerie = (search) => {
  return new Promise((_resolve, reject) => {
    cache('api-series', search.toLowerCase()).then(serie => {
      _resolve(serie)
    })
      .catch(() => {
        requestPromise.get(movieApi.urlSearch + movieApi.appKey + encodeURI(search) + movieApi.language + movieApi.imageInclude).then((response) => {
          Promise.all(JSON.parse(response).results.filter((s, i) => i < 10).map(serie => {
            return new Promise(resolve => {
              crawler.queue({
                uri: `https://www.imdb.com/search/title?title=${encodeURI(serie.original_name.split(' ').join('+'))}&title_type=tv_series`,
                callback: function (err, resp, done) {
                  if (!err) {
                    const { $ } = resp
                    const imdb = $('#main > div > div > div.lister-list > div:nth-child(1) > div.lister-item-content > h3 > a')
                    const rate = $('#main > div > div > div.lister-list > div:nth-child(1) > div.lister-item-content > div > div.inline-block.ratings-imdb-rating > strong').text()
                    const voteCount = $('#main > div > div > div.lister-list > div:nth-child(1) > div.lister-item-content > p.sort-num_votes-visible > span:nth-child(2)').text()
                    if (voteCount) serie.vote_count = voteCount
                    if (rate) serie.vote_average = parseFloat(rate)
                    if (imdb.length) serie.imdb = imdb[0].attribs.href.split('/')[2]
                    resolve(serie)
                  } else {
                    reject(err)
                  }
                  done()
                }
              })
            })
          })).then(async series => {
            await saveSeries(search, series)
            _resolve(series)
          })
        })
          .catch(err => {
            reject(err)
          })
      })
  })
}

export const SerieDetail = (serieId) => {
  return new Promise((_resolve, _reject) => {
    cache('api-series-details', serieId.toLowerCase()).then(async serie => {
      await saveSerieId(serieId, serie)
      _resolve(serie)
    })
      .catch(async () => {
        requestPromise.get(movieApi.urlDetails + encodeURI(serieId) + movieApi.appKey + movieApi.language + movieApi.imageInclude).then(async (response) => {
          const serie = JSON.parse(response)
          /*serie.images.backdrops = serie.images.backdrops.filter((image, index) => {
            return index < 20
          })*/
          await saveSerieId(serieId, serie)
          _resolve(serie)
        }).catch(err => {
          _reject(err)
        })
      })
  })
}

export const SerieSeason = (serieId, seasonNumber) => {
  return new Promise((_resolve, _reject) => {
    cache('api-season-details', serieId + '-' + seasonNumber).then(season => {
      _resolve(season)
    })
      .catch(() => {
        requestPromise.get(movieApi.urlDetails + encodeURI(serieId) + '/season/' + encodeURI(seasonNumber) + movieApi.appKey + movieApi.language + movieApi.imageInclude).then(async (response) => {
          const season = JSON.parse(response)
          if (season.episodes.length) {
            await saveSeasonId(serieId, seasonNumber, season)
            _resolve(season)
          } else {
            await saveSeasonId(serieId, seasonNumber, season)
            _resolve(season)
          }
        })
      })
  })
}


const saveSeries = async (search, series) => {
  cache('api-series', search.toLowerCase(), series, 'inAweek')
  await Promise.all(series.map(serie => {
    mongodb.collection('api-series').updateOne({ id: serie.id }, { $set: serie }, { upsert: true })
  }))
}

const saveSerieId = async (serieId, serie) => {
  cache('api-series-details', serieId.toLowerCase(), serie, 'inAweek')
  await mongodb
    .collection('api-series')
    .updateOne(
      { id: parseInt(serieId) },
      {
        $set: {
          details: serie
        }
      },
    )
}

const saveSeasonId = async (serieId, seasonNumber, season) => {
  cache('api-season-details', serieId + '-' + seasonNumber, season, 'inAweek')
  mongodb
    .collection('api-series-season')
    .updateOne(
      { id: parseInt(season.id) },
      {
        $set: season
      },
    )
}

const getSerieById = async (serieId) => {
  return await mongodb
    .collection('api-series-season')
    .findOne(
      { id: parseInt(serieId) }
    )
}