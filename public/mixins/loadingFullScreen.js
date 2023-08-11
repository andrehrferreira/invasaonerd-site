import { mapActions } from 'vuex'

export default {
    beforeMount() {
        this.setLoadingFullScreen(false)
    },
    methods: {
        ...mapActions(['setLoadingFullScreen'])
    }
}
