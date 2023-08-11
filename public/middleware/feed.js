export default function({ redirect, store }) {
    if (store.state.auth.hasUserLogged) {
        redirect('/feed')
    }
}
