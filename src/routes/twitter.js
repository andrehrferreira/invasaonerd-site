import { getTwitter } from '../controllers/twitter'

export default async (router) => {
    router.route('/twitter')
        .get(getTwitter);

}
