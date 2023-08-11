
import Crawler from 'crawler'
const crawler = new Crawler({ maxConnections: 10 })

export const getTwitter = async (req, res) => {
  try {
    const { url } = req.query;
    if (url) {
      const channels = await getTwitterApi(url);
      res.json(channels);
    } else {
      res.status(400).send({ error: 'Search is required' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}

const getTwitterApi = (url) => {
  return new Promise((resolve, reject) => {
    crawler.queue({
        uri: url,
        callback: function(err, res, done) {
            if(err) {
                reject({ error: true })
            } else {
                const { $ } = res
                var cover = $('div.ProfileCanopy-headerBg > img')
                if (cover.length) cover = cover[0].attribs.src
                else cover = ''
                var avatar = $('a.ProfileAvatar-container > img')
                if (avatar.length) avatar = avatar[0].attribs.src
                else avatar = ''
                if (cover || avatar) {
                    resolve({
                        cover,
                        avatar
                    })
                } else {
                    reject({ error: true })
                }
            }
            done()
        }
    })
})
}