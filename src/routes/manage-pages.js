import { getPagesList, setEngagement, getPage, setSEO } from '../controllers/manage-pages'

import { isAuthenticated } from '../controllers/auth'

export default async (router) => {
    router.route('/manage-pages')
        .all(isAuthenticated())
        .get(getPagesList)
    
    
    router.route('/manage-pages/:pageId')
        .all(isAuthenticated())
        .get(getPage)
    
    router.route('/manage-pages/:pageId/engagement')
        .all(isAuthenticated())
        .post(setEngagement)
    
    router.route('/manage-pages/:pageId/seo')
        .all(isAuthenticated())
        .post(setSEO)

}