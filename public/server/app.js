import '@babel/polyfill/noConflict'

import express from 'express'
import consola from 'consola'
import dotenv from 'dotenv'
import passport from 'passport'
import session from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import redisStore from 'connect-redis'
import { Nuxt, Builder } from 'nuxt'
// import './auth'
;(async () => {
    dotenv.config() // Load .env
    const app = express()

    const RedisStore = redisStore(session)

    app.use(bodyParser.json())
    app.use(cookieParser())

    app.use(
        session({
            store: new RedisStore({
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT
            }),
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 86400000
            }
        })
    )

    // app.use(passport.initialize())
    // app.use(passport.session())

    const config = require('../nuxt.config.js')
    config.dev = !(process.env.NODE_ENV === 'production')

    const nuxt = new Nuxt(config)

    const {
        host = process.env.HOST || '127.0.0.1',
        port = process.env.PORT || 3000
    } = nuxt.options.server

    if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
    } else {
        await nuxt.ready()
    }

    // app.use('/auth', auth)
    app.use(nuxt.render)
    app.listen(port, host)

    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
    })
})()
