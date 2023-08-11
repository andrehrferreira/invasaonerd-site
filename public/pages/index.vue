<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-layout>
                <v-flex xs12>
                    <InHero />
                </v-flex>
            </v-layout>
            <v-flex xs12>
                <InExplorer />
            </v-flex>
        </v-flex>
    </v-layout>
</template>

<script>
import InHero from '@/components/home/InHero'
import InExplorer from '@/components/home/InExplorer'
import scrollPage from '@/mixins/scrollPage'
import loadingFullScreen from '@/mixins/loadingFullScreen'
export default {
    middleware: 'feed',
    components: {
        InHero,
        InExplorer
    },
    mixins: [scrollPage, loadingFullScreen],
    async asyncData({ store: { state }, app: { $axios }, error }) {
        try {
            if (state.pages.length === 0) {
                const { categories, pages } = await $axios.$get('/home')
                return {
                    categories,
                    pages
                }
            }
            return {
                categories: state.categories,
                pages: state.pages
            }
        } catch (e) {
            error({ statusCode: 404, message: 'Página não encontrada' })
        }
    },
    beforeMount() {
        const { categories, pages } = this
        const { commit } = this.$store
        commit('SET_CATEGORIES', categories)
        commit('SET_PAGES', pages)
        commit('CLEAR_DATA_PAGE')
        commit('app/SET_SHOW_EXTENDED_NAVBAR', true)
        commit('app/SET_TIMELINE', true)
    },
    destroyed() {
        this.$store.commit('app/SET_SHOW_EXTENDED_NAVBAR', false)
        this.$store.commit('app/SET_TIMELINE', false)
    }
}
</script>

<style></style>
