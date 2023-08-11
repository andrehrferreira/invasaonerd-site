
import { signinLocal, getUserByToken, signupWithEmailAndPassword, checkAvailable, signinWithGoogle } from '../controllers/auth'

export default async (router) => {

  router.route('/auth/signin/local')
    .post(signinLocal)
  
  router.route('/auth/signin/google')
    .post(signinWithGoogle)
  
  router.route('/auth/singup')
    .post(signupWithEmailAndPassword)
  
  router.route('/auth/checkuser')
    .post(getUserByToken)
  
  router.route('/auth/checkavailable')
    .post(checkAvailable)

}