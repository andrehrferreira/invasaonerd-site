const cookieparser = process.server ? require('cookieparser') : undefined

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a)
    var bProps = Object.getOwnPropertyNames(b)

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i]

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true
}

export const state = () => ({
    categories: [],
    pages: [],
    pageItem: {},
    order: {},
    user: null,
    ready: true,
    loadingFullScreen: false
})

export const mutations = {
    SET_CATEGORIES(state, categories) {
        state.categories = categories.sort((a, b) =>
            a.text.localeCompare(b.text)
        )
    },
    SET_PAGES(state, pages) {
        pages.map(p => {
            if (state.pages.every(_ => _.ref != p.ref)) state.pages.push(p)
        })
    },

    SET_PAGE(state, page) {
        if (!page.typesRemoved) page.typesRemoved = []
        state.pageItem = page
    },

    SET_ORDER(state, order) {
        state.order = order
    },

    SET_PAGE_CHANGE: (state, payload) => {
        state.pageItem = Object.assign({}, state.pageItem, payload)
    },

    SET_CHANGE: (state, payload) => {
        let { pageItem } = state
        if (!pageItem.changes) pageItem.changes = []
        if (Array.isArray(payload)) {
            payload.forEach(item => {
                if (!exists(item.type)) pageItem.changes.push(item)
            })
        } else {
            if (!exists(payload.type)) pageItem.changes.push(payload)
        }
        state.pageItem = pageItem

        function exists(t) {
            return pageItem.changes.some(({ type }) => t == type)
        }
    },

    SAVE_LOCAL_STORAGE: state => {
        if (state.page.editMode)
            localStorage.setItem(
                'page-' + state.pageItem.ref,
                JSON.stringify(state.pageItem)
            )
    },
    REMOVE_LOCAL_STORAGE: state => {
        if (localStorage.hasOwnProperty('page-' + state.pageItem.ref)) {
            localStorage.removeItem('page-' + state.pageItem.ref)
        }
    },

    REDO_TYPE: (state, payload) => {
        let { pageItem } = state

        if (!pageItem.typesRemoved) pageItem.typesRemoved = []

        pageItem.typesRemoved = pageItem.typesRemoved.filter(r => r != payload)
        state.pageItem = pageItem
    },

    REMOVE_TYPE: (state, payload) => {
        let { pageItem } = state

        if (!pageItem.typesRemoved) pageItem.typesRemoved = []

        pageItem.typesRemoved.push(payload)

        state.pageItem = pageItem
    },

    SET_TEMP: (state, payload) => {
        let { pageItem } = state
        const temp = Object.assign({}, pageItem.temp, payload)
        state.pageItem.temp = temp
        state.pageItem = pageItem
    },

    EDIT_PAGE: (state, { type, key, value, data }) => {
        let { pageItem } = state
        pageItem[type] = pageItem[type].map(item => {
            if (item[key] === value) {
                return {
                    ...item,
                    ...data
                }
            }
            return item
        })
        state.pageItem = pageItem
    },

    CANCEL_EDIT_PAGE: state => {
        let { pageItem } = state
        if (localStorage.hasOwnProperty('original-page-' + pageItem.ref)) {
            pageItem = JSON.parse(
                localStorage.getItem('original-page-' + pageItem.ref)
            )
        }
        pageItem.changes = []
        state.pageItem = pageItem
    },

    SET_PAGE_INFO_BASIC: (state, payload) => {
        let { pageItem } = state
        if (!pageItem.changes) pageItem.changes = []
        Object.entries(payload).map(([key, value]) => {
            if (value.url) {
                const actual = pageItem[key] || {}
                if (!isEquivalent(actual, value)) {
                    pageItem.changes.push({
                        type: key,
                        action: 'update'
                    })
                }
                pageItem[key] = Object.assign(actual, value)
            }
        })
        state.pageItem = pageItem
    },

    SET_READY: (state, payload) => {
        state.ready = payload
    },

    SET_LOADING_FULL_SCREEN: (state, payload) => {
        state.loadingFullScreen = payload
    },

    CLEAR_DATA_PAGE: state => {
        state.pageItem = {}
    },

    ADD_TYPE: (state, payload) => {
        let { pageItem } = state
        const { type, value } = payload
        pageItem[type] = value
        state.pageItem = pageItem
    }
}

export const actions = {
    async nuxtServerInit(
        vueContext,
        {
            app: { $axios },
            params,
            error,
            req
        }
    ) {
        try {
            let auth = {
                token: null
            }
            let user = null
            let notifications = []
            let userPages = []

            if (req.headers.cookie) {
                const parsed = cookieparser.parse(req.headers.cookie)
                try {
                    auth = JSON.parse(parsed.auth)

                    $axios.setHeader('Authorization', 'Bearer ' + auth.token)
                    user = await $axios.$post('/auth/checkuser', {
                        token: auth.token
                    })
                    try {
                        let userCookie = undefined
                        if (parsed.user) userCookie = JSON.parse(parsed.user)
                        if (userCookie != undefined)
                            user.newuser = userCookie.newuser
                    } catch (error) {
                        // No valid newuser found
                    }
                    notifications = await $axios.$get('/user/notifications')
                    userPages = await $axios.$get('/user/pages')
                    userPages = userPages.sort(
                        (a, b) => b.notifications - a.notifications
                    )
                } catch (err) {
                    // No valid cookie found
                }
            }
            if (!user) {
                if (Object.keys(params).length === 0) {
                    const { categories, pages } = await $axios.$get('/home')
                    vueContext.commit('SET_CATEGORIES', categories)
                    vueContext.commit('SET_PAGES', pages)
                }
            }
            vueContext.commit('auth/SET_TOKEN', auth.token)
            vueContext.commit('auth/SET_USER', user)
            vueContext.commit('auth/SET_USER_NOTIFICATIONS', notifications)
            vueContext.commit('auth/SET_USER_PAGES', userPages)
        } catch (e) {
            error({
                statusCode: 404,
                message: 'Página não encontrada'
            })
        }
    },

    SET_CATEGORIES({ commit }, categories) {
        commit('SET_CATEGORIES', categories)
    },

    SET_PAGES({ commit }, pages) {
        commit('SET_PAGES', pages)
    },

    setPage({ commit }, page) {
        commit('SET_PAGE', page)
    },

    setOrder({ commit }, order) {
        commit('SET_ORDER', order)
    },

    setPageChange: async ({ commit }, payload) => {
        commit('SET_PAGE_CHANGE', payload)
    },

    setChange: ({ commit }, payload) => {
        commit('SET_CHANGE', payload)
    },

    removeType: ({ commit }, payload) => {
        commit('REMOVE_TYPE', payload)
    },

    redoType: ({ commit }, payload) => {
        commit('REDO_TYPE', payload)
    },

    saveLocalStorage: ({ commit }) => {
        commit('SAVE_LOCAL_STORAGE')
    },

    removeLocalStorage: ({ commit }) => {
        commit('REMOVE_LOCAL_STORAGE')
    },

    setTemp: ({ commit, dispatch }, payload) => {
        commit('SET_TEMP', payload)
        dispatch('saveLocalStorage')
    },

    editPage: ({ commit, dispatch }, payload) => {
        commit('EDIT_PAGE', payload)
        dispatch('saveLocalStorage')
    },

    setPageInfoBasic: ({ commit, dispatch }, payload) => {
        commit('SET_PAGE_INFO_BASIC', payload)
        dispatch('saveLocalStorage')
    },

    cancelPage: ({ commit, dispatch }, payload) => {
        commit('CANCEL_EDIT_PAGE', payload)
        dispatch('removeLocalStorage')
    },

    setReady: ({ commit }, payload) => {
        commit('SET_READY', payload)
    },

    setLoadingFullScreen: ({ commit }, payload) => {
        commit('SET_LOADING_FULL_SCREEN', payload)
    },

    clearDataPage: ({ commit }, payload) => {
        commit('CLEAR_DATA_PAGE', payload)
    },

    addType: ({ commit }, payload) => {
        commit('ADD_TYPE', payload)
    }
}

export const getters = {
    getCategories(state) {
        return state.categories
    },
    getPages(state) {
        return state.pages
    },
    getPage(state) {
        return state.pageItem
    },
    hasPages(state) {
        const { pages } = state
        return pages && pages.length
    },
    hasPage(state) {
        return state.pageItem && Object.keys(state.pageItem).length > 0
    },
    hasPageFeedback(state) {
        return state.pageItem && state.pageItem.feedbackDate
    },
    pageURL(state) {
        return state.pageItem && state.pageItem.url
    },
    getPageConfig(state) {
        return state.pageItem && state.pageItem.configs
            ? state.pageItem.configs.images
            : {
                  avatar: null,
                  cover: null
              }
    },
    getOrder(state) {
        return state.order
    },
    isActiveAproveButton(state) {
        return (
            state.pageItem &&
            state.pageItem.changes &&
            state.pageItem.changes.length
        )
    },
    userLogged(state) {
        return (
            state.user || {
                _id: '5bd755878420bd004efc9b43',
                name: 'Caio Sergio Boecher Pereira',
                user: 'Caio',
                email: 'caio@invasaonerd.com.br',
                avatar: '/assets/img/useravatar.png'
            }
        )
    },

    isReady(state) {
        return state.ready
    },

    loadingFullScreen(state) {
        return state.loadingFullScreen
    },

    typesRemoved(state) {
        return state.pageItem.typesRemoved || []
    }
}
