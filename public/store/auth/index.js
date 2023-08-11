export const strict = false

export const state = () => ({
    isAdmin: false,
    isSuperAdmin: true,
    hasUserLogged: false,
    modalLogin: false,
    user: null,
    token: null,
    pages: [],
    feeds: [],
    suggestions: [],
    allSuggestions: [],
    notifications: [],
    redirectAfterLogin: '/feed',
    executedFunctionAfterLogin: null,
    userSuggestionFrequency: 10,
    noSuggestions: []
})

export const mutations = {
    SET_MODAL_LOGIN: (state, payload) => {
        state.modalLogin = payload
    },

    SET_USER: (state, payload) => {
        if (payload && payload.id) {
            state.user = payload
            state.hasUserLogged = true
            state.isAdmin = payload.admin
            state.isSuperAdmin = payload.superadmin
        } else {
            state.user = null
            state.hasUserLogged = false
            state.isAdmin = false
            state.isSuperAdmin = false
        }
    },

    SET_TOKEN: (state, payload) => {
        state.token = payload
    },

    SET_ALL_SUGGESTIONS: (state, payload) => {
        state.allSuggestions = payload
    },

    SET_USER_PAGES: (state, payload) => {
        if (payload)
            state.pages = payload.sort(
                (a, b) => b.notifications - a.notifications
            )
        else {
            state.pages = []
        }
        if (state.pages.length == 0 && state.user) {
            state.user.newuser = true
        }
    },

    SET_USER_FEEDS: (state, payload) => {
        state.feeds = payload
    },

    SET_USER_NOTIFICATIONS: (state, payload) => {
        state.notifications = payload.sort((a, b) => {
            if (a.timestamp > b.timestamp) return -1
            return 1
        })
    },

    SET_USER_SUGGESTIONS: (state, payload) => {
        state.suggestions = payload.filter(
            ({ id }) =>
                state.user.blackListPages.every(page => page.id !== id) &&
                state.user.pages.every(pageId => pageId !== id)
        )
    },

    SET_USER_NO_SUGGESTIONS: (state, payload) => {
        const { noSuggestions } = state
        if (!Array.isArray(payload) && !noSuggestions.includes(payload)) {
            noSuggestions.push(payload)
            state.noSuggestions = noSuggestions
        } else {
            state.noSuggestions = payload
        }
    },

    SET_OPEN_NOTIFICATION: (state, notification) => {
        state.notifications = state.notifications.map(n => {
            if (n.timestamp === notification.timestamp) {
                n.clicked = true
                n.new = false
            }
            return n
        })
    },

    SET_REDIRECT_AFTER_LOGIN: (state, payload) => {
        state.redirectAfterLogin = payload
    },

    SET_USER_SUGGESTION_FREQUENCY: (state, payload) => {
        state.userSuggestionFrequency = payload
    },

    EXECUTED_FUNCTION_AFTER_LOGIN: (state, payload) => {
        state.executedFunctionAfterLogin = payload
    }
}

export const actions = {
    setModalLogin: ({ commit }, payload) => {
        commit('SET_MODAL_LOGIN', payload)
    },

    setUser: ({ commit }, payload) => {
        commit('SET_USER_NO_SUGGESTIONS', (payload || {}).noSuggestions || [])
        commit('SET_USER', payload)
    },

    setToken: ({ commit }, payload) => {
        commit('SET_TOKEN', payload)
    },

    setUserPages: ({ commit }, payload) => {
        commit('SET_USER_PAGES', payload)
    },

    setUserFeeds: ({ commit, state }, payload) => {
        payload.forEach((feed, index) => {
            if (
                (index + 1) % state.userSuggestionFrequency === 0 &&
                index !== 0 &&
                feed.type !== 'suggestions'
            ) {
                let suggestions = state.suggestions.filter((s, i) => i < 3)
                commit(
                    'SET_USER_SUGGESTIONS',
                    state.suggestions.filter(suggestion =>
                        suggestions.every(s => s.id !== suggestion.id)
                    )
                )
                payload.splice(index, 0, {
                    type: 'suggestions',
                    suggestions
                })
            }
        })
        commit('SET_USER_FEEDS', payload)
    },

    setUserNotifications: ({ commit }, payload) => {
        commit('SET_USER_NOTIFICATIONS', payload)
    },

    setOpenNotification: ({ commit }, payload) => {
        commit('SET_OPEN_NOTIFICATION', payload)
    },

    setRedirectAfterLogin: ({ commit }, payload) => {
        commit('SET_REDIRECT_AFTER_LOGIN', payload)
    },

    setExecutedFunctionAfterLogin: ({ commit }, payload) => {
        commit('EXECUTED_FUNCTION_AFTER_LOGIN', payload)
    }
}

export const getters = {
    isAdmin(state) {
        return state.isAdmin
    },

    isSuperAdmin(state) {
        return state.isSuperAdmin
    },

    hasUserLogged(state) {
        return state.hasUserLogged
    },

    modalLogin(state) {
        return state.modalLogin
    },

    userLogged(state) {
        return state.user || {}
    },

    userPagesList(state) {
        return state.pages
    },

    feedList(state) {
        return state.feeds
    },

    notificationsList(state) {
        return state.notifications
    },

    getNewNotifications(state) {
        const { notifications } = state
        return notifications.filter(notification => {
            return notification.new
        })
    },

    redirectAfterLogin(state) {
        return state.redirectAfterLogin
    },

    executedFunctionAfterLogin(state) {
        return state.executedFunctionAfterLogin
    },

    loadMoreSuggestions: ({ suggestions }) => Number(!suggestions.length)
}
