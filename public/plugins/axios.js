export default function({ $axios, store }) {
    $axios.onRequest(config => {
        if (store.state.auth.token) {
            config.headers.common['Authorization'] =
                'Bearer ' + store.state.auth.token
            config.headers.common['Content-Type'] = 'application/json'
        }
    })

    $axios.onError(error => {
        const code = parseInt(error.response && error.response.status)
        switch (code) {
            case 502:
                console.log('API invativa')
                break
        }
    })
}
