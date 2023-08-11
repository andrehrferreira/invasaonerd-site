import { fetchFavicon } from '@meltwater/fetch-favicon'

export const getIconWebsite = async(req, res) => {
  try {
    const { url } = req.query;
    if (url) {
      const icon = await getIconWebsiteApi(url);
      res.json(icon);
    } else {
      res.status(400).send({ error: 'Url is required' })
    }
  } catch (error) {
    res.status(500).send(error)
  }
}

const getIconWebsiteApi = async (url) => {
  try {
    return fetchFavicon(url)
  } catch (error) {
    return error
  }
}