const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
    env: {
        userSuggestionFrequency: process.env.USER_SUGGESTION_FREQUENCY || 5
    },

    mode: 'universal',

    server: {
        host: '0.0.0.0' // default: localhost,
    },

    /*
     ** Headers of the page
     */
    head: {
        title: 'Invasão Nerd',
        meta: [
            {
                charset: 'utf-8'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: 'A maior comunidade nerd do brasil'
            },
            {
                name: 'google-signin-client_id',
                content: process.env.GOOGLE_CLIENT_ID
            }
        ],
        link: [
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico'
            },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css?family=Material+Icons'
            },
            {
                rel: 'stylesheet',
                href:
                    'https://fonts.googleapis.com/css?family=Lato&display=swap'
            },
            {
                rel: 'stylesheet',
                href: 'https://use.fontawesome.com/releases/v5.0.13/css/all.css'
            }
        ]
    },

    /*
     ** Customize the progress-bar color
     */
    loading: {
        color: '#fff'
    },

    /*
     ** Global CSS
     */
    css: [
        '~/assets/style/main.css',
        '~/assets/style/app.styl',
        'swiper/dist/css/swiper.css',
        'quill/dist/quill.snow.css',
        'quill/dist/quill.bubble.css',
        'quill/dist/quill.core.css'
    ],

    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        '~/plugins/inimage.js',
        '~/plugins/vuetify',
        '~/plugins/axios.js',
        '~/plugins/prototype.js',
        {
            ssr: false,
            src: '@/plugins/swiper'
        },
        {
            ssr: false,
            src: '@/plugins/loadscript'
        },
        {
            ssr: false,
            src: '@/plugins/nuxt-quill-plugin.js'
        },
        {
            src: '~plugins/google.js',
            ssr: false
        }
    ],

    /*
     ** Nuxt.js modules
     */
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/pwa',

        [
            '@neneos/nuxt-animate.css',
            {
                maxAge: 1000 * 60 * 60
            }
        ],
        [
            'nuxt-fire',
            {
                // Required:
                config: {
                    development: {
                        apiKey: process.env.FIREBASE_API_KEY,
                        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
                        databaseURL: process.env.FIREBASE_DATABASE_URL,
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        storageBucket: '',
                        messagingSenderId:
                            process.env.FIREBASE_MESSAGING_SENDER_ID,
                        appId: process.env.FIREBASE_APP_ID
                    },
                    production: {
                        apiKey: process.env.FIREBASE_API_KEY,
                        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
                        databaseURL: process.env.FIREBASE_DATABASE_URL,
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        storageBucket: '',
                        messagingSenderId:
                            process.env.FIREBASE_MESSAGING_SENDER_ID,
                        appId: process.env.FIREBASE_APP_ID
                    }
                },
                // The following options are optional:
                useOnly: ['messaging'],
                customEnv: false,
                functionsLocation: 'us-central1'
            }
        ]
    ],
    /*
     ** Axios module configuration
     */
    axios: {
        baseURL: process.env.BASE_URL || 'http://localhost:5555/api'
    },

    /*
     ** Build configuration
     */
    build: {
        transpile: ['vuetify/lib'],
        plugins: [new VuetifyLoaderPlugin()],
        loaders: {
            stylus: {
                import: ['~assets/style/variables.styl']
            }
        },
        extend(config, ctx) {
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                if (ctx.isDev && ctx.isClient) {
                    config.devtool = '#source-map'
                }
            }
        }
    },
    workbox: {
        importScripts: ['firebase-messaging-sw.js'],
        dev: true
    },
    manifest: {
        name: 'Invasão Nerd',
        gcm_sender_id: '103953800507'
    },

    serverMiddleware: ['~/middleware/redirect-to-www.js']
}
