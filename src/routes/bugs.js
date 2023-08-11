import { sendBug, getBugs, getBugById, getScreenshotByBugId, getBug } from '../controllers/bugs'
import { isAuthenticated } from '../controllers/auth'

export default async (router) => {
    router.route('/bugs')
        .get(getBugs)
        .all(isAuthenticated())
        .post(sendBug)

    router.route('/bugs/:bugId/:index')
        .get(getScreenshotByBugId)
    
    router.route('/bugs/:bugId')
        .get(getBug)


    router.param('bugId', getBugById);
}