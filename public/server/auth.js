// import '@babel/polyfill/noConflict'

// import { Router } from 'express'
// import passport from 'passport'
// import dotenv from 'dotenv'
// import md5 from 'md5'

// import KeycloakStrategy from '@exlinc/keycloak-passport'

// dotenv.config() // Load .env
// passport.initialize()

// passport.serializeUser((user, done) => {
//   done(null, JSON.stringify(user))
// })

// passport.deserializeUser((user, done) => {
//   user = JSON.parse(user)
//   user.hash = md5(user.email)
//   user.avatar = `//gravatar.com/avatar/${user.hash}?s=200`

//   done(null, user)
// })

// passport.use(
//   'keycloak',
//   new KeycloakStrategy(
//     {
//       host: process.env.KEYCLOAK_HOST,
//       realm: process.env.KEYCLOAK_REALM,
//       clientID: process.env.KEYCLOAK_CLIENT_ID,
//       clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
//       callbackURL: `/auth/callback`,
//       authorizationURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${
//         process.env.KEYCLOAK_REALM
//       }/protocol/openid-connect/auth`,
//       tokenURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${
//         process.env.KEYCLOAK_REALM
//       }/protocol/openid-connect/token`,
//       userInfoURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${
//         process.env.KEYCLOAK_REALM
//       }/protocol/openid-connect/userinfo`
//     },
//     (accessToken, refreshToken, profile, done) => {
//       done(null, profile)
//     }
//   )
// )

// const router = Router()

// router.get('/login', passport.authenticate('keycloak'))

// router.get('/callback', passport.authenticate('keycloak'), (req, res) => {
//   res.redirect('/admin')
// })

// router.get('/logout', (req, res) => {
//   req.logout()
//   res.redirect('/admin')
// })

// export default router
