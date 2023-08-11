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
import { mapGetters, mapMutations } from 'vuex'
import scrollPage from '@/mixins/scrollPage'
export default {
    middleware: 'auth',
    components: {
        InHero,
        InExplorer
    },
    mixins: [scrollPage],
    data() {
        return {
            loadingFeed: false,
            hasNext: true
        }
    },
    computed: {
        ...mapGetters('app', ['scrollTop', 'scrollHeight', 'clientHeight'])
    },
    async asyncData({ store: { state, dispatch }, app: { $axios }, error }) {
        try {
            if (state.pages.length === 0) {
                const {
                    categories,
                    pages,
                    suggestions,
                    user
                } = await $axios.$get('/home')
                dispatch(
                    'auth/setUser',
                    Object.assign(
                        JSON.parse(JSON.stringify(state.auth.user)),
                        user
                    )
                )
                return {
                    categories,
                    pages,
                    suggestions
                }
            }
            return {
                categories: state.categories,
                pages: state.pages,
                suggestions: state.auth.suggestions
            }
        } catch (e) {
            error({ statusCode: 404, message: 'Página não encontrada' })
        }
    },
    beforeMount() {
        const { categories, pages, suggestions } = this
        const { commit } = this.$store
        if (suggestions) {
            this.setUserSuggestions(suggestions)
        }
        commit('SET_CATEGORIES', categories)
        commit('SET_PAGES', pages)
        commit('CLEAR_DATA_PAGE')
        commit('app/SET_TIMELINE', true)
        commit('app/SET_SHOW_EXTENDED_NAVBAR', true)
    },
    methods: {
        ...mapMutations('auth', { setUserSuggestions: 'SET_USER_SUGGESTIONS' })
    }
}
</script>

<style></style>
