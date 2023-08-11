import { getPageByCategory, getPageByUrl, getPagesByRef, checkPage, getFeaturedPages, sendRevision, getPageByRef } from '../controllers/pages'

export default async (router) => {
  router.route('/page')
    .get(getPageByCategory)

  router.route('/page/url/:url')
    .get(getPageByUrl)
  
  router.route('/page/ref/:ref')
    .get(getPageByRef)
  
  router.route('/page/check')
    .post(checkPage)
  
  router.route('/page/send-revision')
    .post(sendRevision)
  
  router.route('/page/featured-pages')
    .post(getFeaturedPages)
  
  

  router.param('url', getPagesByRef);
}