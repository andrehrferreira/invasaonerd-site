import { getFeaturedPagesAll, getAllSearch } from '../migrates/featuredPages'
import { updateUsersFromProfile, mongoIndexUsers } from '../migrates/users'

export default async (router) => {
    router.route('/migrates/getFeaturedPagesAll')
        .get(getFeaturedPagesAll)

    router.route('/migrates/getAllSearch')
        .get(getAllSearch)

    router.route('/migrates/updateUsersFromProfile')
        .get(updateUsersFromProfile)

    router.route('/migrates/mongoIndexUsers')
        .get(mongoIndexUsers)
}
