import { createNewInvite, registerUserByInviteId } from '../controllers/invites'
import { isAuthenticated } from '../controllers/auth'

export default async (router) => {

    router.route('/invites/createnewinvite')
        .all(isAuthenticated())
        .get(createNewInvite)

    router.route('/invites/register/:inviteId')
        .post(registerUserByInviteId)

}
