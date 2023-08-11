
import { cache } from '../core/cache'
import { mongodb } from "@dekproject/scope"

const wiki = require("wikijs").default
let Labels = require("../models/wiki-types.json")
let Ignore = require("../models/wiki-ignore.json")


export const getWiki = async (req, res) => {
  try {
    const { search } = req.query;
    if (search) {
      const lives = await getWikiApi(search);
      res.json(lives);
    } else {
      res.status(400).send({ error: 'Search is required' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}

const getWikiApi = async (search) => {
  return new Promise((resolve, reject) => {
    cache('api-wiki', search.toLowerCase()).then((wiki) => {
      res.json(wiki);
    }).catch(async () => {
      getInfoWiki(search).then((infos) => {
        const wiki = {
          error: false,
          name: search,
          summary: infos[1],
          fullinfo: infos[0]
        }
  
        cache('api-wiki', search.toLowerCase(), wiki, 'inAday');

        mongodb.collection('api-wiki').updateOne({ name: wiki.name }, { $set: wiki }, { upsert: true });

        resolve(wiki);
      })
      .catch((err) => {
        reject({ error: err });
      })
    })
  })
}
async function getInfoWiki(search) {
	return await Promise.all([
		getFullinfo(search),
		getSummary(search)
	])
}
function getFullinfo(search) {
	return new Promise((resolve, reject) => {
		wiki({ apiUrl: 'https://pt.wikipedia.org/w/api.php' })
		.page(search).then( page => page.fullInfo() )
		.then((data) => {
			let dataReturn = {};

			for (let key in data.general) {
				// if (typeof data.general == "object")
				// 	if (typeof data.general[key].join == "function")
				// 		dataReturn[key] = data.general[key];
				// else
				// 	dataReturn[key] = data.general[key];
				// else
				dataReturn[key] = data.general[key];
			}

			Ignore.forEach(function(key) {
				if (key in dataReturn)
					delete dataReturn[key];
			});

			for (let key in Labels) {
				if (key in dataReturn) {
					dataReturn[Labels[key]] = dataReturn[key];
					delete dataReturn[key];
				}
			}

			resolve(dataReturn)
		}).catch((err) => {
			resolve({})
		});
	})
}

function getSummary(search) {
	return new Promise((resolve, reject) => {
		wiki({ apiUrl: 'https://pt.wikipedia.org/w/api.php' })
		.page(search).then(page => page.summary())
		.then((data) => {
			resolve(data)
		}).catch((err) => {
			resolve('')
		})
	})
}
