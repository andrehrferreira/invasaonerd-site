import request from 'request'

export const getLivesAPI = async (query) => {
  return new Promise((resolve, reject) => {
		request.get({
			url: 'https://api.twitch.tv/kraken/search/streams?query=' + query,
			headers: {
				'Client-ID': 'u9nb9mn7na02vqxio98smfv0b235vq',
				'Content-Type': 'application/json',
				'User-Agent': 'request'
			}
		  } , (err, response, body) => {
			if (err) {
				reject(err)
			} else {
				try {
					const data = JSON.parse(body) 
					if(data && data.streams) {
						resolve(data.streams)
					} else {
						resolve([])
					}
				} catch (error) {
					reject(error)
				}
			}
		})
	})
}

export const getLives = async(req, res) => {
	try {
    const { search } = req.query;
    if (search) {
      const lives = await getLivesAPI(search);
      res.json(lives);
    } else {
      res.status(400).send({ error: 'Search is required' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}