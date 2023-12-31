
import { mongodb } from '@dekproject/scope'
import { cache } from '../core/cache'
import translate from 'translate'
import rp from 'request-promise'

const key = '7dedde722c9257d1da79f405a882be4c'
translate.engine = 'yandex';
translate.key = 'trnsl.1.1.20180811T204940Z.ffe2b5cd06f8d28c.22c475c93acd6c24bba2564f7734828673d57137';

export const getGames = async (req, res) => {
  try {
    const { search } = req.query;
    if (search) {
      const lives = await getGamesAPI(search);
      res.json(lives);
    } else {
      res.status(400).send({ error: 'Search is required' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}



const getGamesAPI = async (query) => {
  return new Promise((_resolve, _reject) => {
    cache('api-games', query.toLowerCase()).then((games) => {
      _resolve(games)
    }).catch(async () => {
      var options = {
        uri: 'https://api-v3.igdb.com/games',
        qs: {
          search: query,
          limit: 30,
          offset: 0,
          fields: 'name,rating,cover.*,first_release_date,artworks.*,videos.*,genres.*,screenshots,platforms.*,summary,websites.*,screenshots.*'
        },
        headers: {
          'user-key': key
        },
        json: true // Automatically parses the JSON string in the response
      };
      rp(options)
        .then(function (data) {
          translateGamesSummaries(data).then(async games => {
            cache('api-games', query.toLowerCase(), games, 'inAday');
            await saveGamesToDatabase(games);
            _resolve(games);
          })

        })
        .catch(function (err) {
          _reject(err)
        });

    })
  })
}

async function saveGamesToDatabase(list) {
  Promise.all(list.map(async item => {
    await mongodb.collection('api-games').updateOne({ name: item.name }, { $set: item }, { upsert: true });
  }))
}

function translateGamesSummaries(games) {
  return Promise.all(games.filter(g => g.cover).map(game => {
    return new Promise((resolve, reject) => {
      translate(game.summary, {
        to: 'pt'
      }).then(text => {
        if (text) game.summary = text;
        resolve(formatImages(game))
      })
    })
  }))
}

function formatImages(game) {
  if (game.screenshots) {
    game.screenshots = game.screenshots.map((image) => {
      image.url = 'https:' + image.url.split('t_thumb').join('t_screenshot_big')
      return image
    });
  }

  if (game.artworks) {
    game.artworks = game.artworks.map((image) => {
      image.url = 'https:' + image.url.split('t_thumb').join('t_screenshot_big')
      return image
    });
  }

  game.cover.url = 'https:' + game.cover.url.split('t_thumb').join('t_720p');

  return game
}

