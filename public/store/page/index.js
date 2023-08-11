export const state = () => ({
    editMode: false,
    adding: false,
    editingType: '',
    buttonState: true,
    box: false,
    basicInfo: false,
    pageLoading: {
        active: false
    },
    activeTab: 0
})

export const mutations = {
    setPage: (state, payload) => {
        Object.entries(payload).map(([key]) => {
            if (
                key !== 'local' &&
                key !== 'temp' &&
                key !== '_id' &&
                key !== 'ref' &&
                key !== 'title' &&
                key !== 'subtitle' &&
                key !== 'status' &&
                key !== 'user' &&
                key !== 'cover' &&
                key !== 'avatar' &&
                key !== 'editRef' &&
                key !== 'miniavatar' &&
                key !== 'id' &&
                key !== 'changes' &&
                key !== 'order' &&
                key !== 'editDate' &&
                key !== 'feedbackDate'
            ) {
                if (!payload.order.includes(key)) {
                    if (key === 'wiki') {
                        payload.order.unshift(key)
                    } else {
                        payload.order.push(key)
                    }
                }
            }
        })
        if (state.editMode)
            localStorage.setItem('page-' + payload.ref, JSON.stringify(payload))
        state.page = payload
    },

    setPageEntry: (state, payload) => {
        const { page } = state
        page[payload.entry] = payload.data
        if (state.editMode)
            localStorage.setItem('page-' + page.ref, JSON.stringify(page))
        state.page = page
    },

    setEditMode: (state, payload) => {
        state.editMode = payload
    },

    setAdding: (state, payload) => {
        state.adding = payload
    },

    setEditingType: (state, payload) => {
        state.editingType = payload
    },

    setButtonState: (state, payload) => {
        state.buttonState = payload
    },

    SET_STATE_BOX: (state, payload) => {
        state.box = payload == undefined ? !state.box : payload
    },

    SET_STATE_BASIC_INFO: (state, payload) => {
        state.basicInfo = payload == undefined ? !state.basicInfo : payload
    },

    SET_PAGE_LOADING: (state, payload) => {
        state.pageLoading = payload
    },

    SET_ACTIVE_TAB: (state, payload) => {
        state.activeTab = payload
    }
}

export const actions = {
    setPageEntry: ({ commit }, payload) => {
        commit('setPageEntry', payload)
    },

    setEditMode: ({ commit }, payload) => {
        commit('setEditMode', payload)
    },

    setAdding: ({ commit }, payload) => {
        commit('setAdding', payload)
    },

    setEditingType: ({ commit }, payload) => {
        commit('setEditingType', payload)
    },

    setButtonState: ({ commit }, payload) => {
        commit('setButtonState', payload)
    },

    setStateBox: ({ commit }, payload) => {
        commit('SET_STATE_BOX', payload)
    },

    setStateBasicInfo: ({ commit }, payload) => {
        commit('SET_STATE_BASIC_INFO', payload)
    },

    setPageLoading: ({ commit }, payload) => {
        commit('SET_PAGE_LOADING', payload)
    },

    setActiveTab: ({ commit }, payload) => {
        commit('SET_ACTIVE_TAB', payload)
    }
}

export const getters = {
    editMode(state) {
        return state.editMode && state.editingType == ''
    },

    isActiveFloatingButton(state) {
        return state.editMode
    },

    isActiveCancelButton(state) {
        return state.editMode && state.adding
    },

    adding(state) {
        return state.adding
    },

    editingType(state) {
        return state.editingType
    },

    buttonState(state) {
        return state.buttonState
    },

    isActiveBoxEditor(state) {
        return state.box
    },

    isActiveBasicInfo(state) {
        return state.basicInfo
    },

    pageLoading(state) {
        return state.pageLoading
    },

    activeTab(state) {
        return state.activeTab
    }
}
