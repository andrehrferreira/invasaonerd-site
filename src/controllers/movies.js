import { cache } from '../core/cache'
import requestPromise from 'request-promise'

export const getMoviesAPI = async (query) => {
  return new Promise((_resolve, _reject) => {
    cache('api-movies', query.toLowerCase()).then((movies) => {
      res.json(movies);
    }).catch(() => {
      const movieApi = {
        url: 'https://api.themoviedb.org/3/search/movie',
        appKey: '?api_key=f1c8ddd206d8543fac2ff357ceaa9b39&query=',
        language: '&language=pt-BR',
        imageInclude: '&append_to_response=images&include_image_language=pt-BR,null'
      }

      requestPromise.get(movieApi.url + movieApi.appKey + encodeURI(query) + movieApi.language + movieApi.imageInclude).then((response) => {
        const movies = JSON.parse(response).results;
        cache('api-movies', query.toLowerCase(), movies, 'inAday');
        _resolve(movies);
      })
        .catch(err => {
          _reject(err);
        })
    });
  })
}

export const getMovies = async (req, res) => {
  try {
    const { search } = req.query;
    if (search) {
      const lives = await getMoviesAPI(search);
      res.json(lives);
    } else {
      res.status(400).send({ error: 'Search is required' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}