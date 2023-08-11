import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters(['typesRemoved']),
        removed() {
            return this.typesRemoved.includes(this.type)
        },
        styles() {
            return {
                backgroundColor: this.removed ? 'red' : ''
            }
        }
    }
}
