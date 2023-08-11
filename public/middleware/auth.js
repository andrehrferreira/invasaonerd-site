export default function({ redirect, store, route }) {
    if (!store.state.auth.hasUserLogged) {
        redirect('/')
    } else if (
        !route.path.includes('/newuser') &&
        store.getters['auth/userLogged'].newuser
    ) {
        store.commit('SET_LOADING_FULL_SCREEN', false)
        redirect('/newuser')
    } else if (
        route.path.includes('/newuser') &&
        !store.getters['auth/userLogged'].newuser
    ) {
        redirect('/')
    }
}
