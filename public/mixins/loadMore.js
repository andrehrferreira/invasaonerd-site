import { mapActions } from 'vuex'

export default {
    data() {
        return {
            loading: false,
            hasNext: true
        }
    },
    methods: {
        ...mapActions(['SET_PAGES']),
        async loadMore(payload, percent = 0.9) {
            const { length } = this.pages
            const { category } = this
            let { hasNext, loading } = this
            if (payload >= percent && !loading && hasNext) {
                this.loading = true
                try {
                    const { hasNext: _hasNext, pages } = await this.$axios.$get(
                        `/page?skip=${length}&limit=${10}&category=${
                            category.text
                        }`
                    )
                    this.SET_PAGES(pages)
                    this.hasNext = _hasNext
                    setTimeout(() => {
                        this.loading = false
                    }, 500)
                } catch (error) {
                    this.loading = false
                }
            }
        }
    }
}
