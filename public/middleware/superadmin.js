export default function({ redirect, store }) {
    if (!store.state.auth.isSuperAdmin) {
        redirect('/')
    }
}
