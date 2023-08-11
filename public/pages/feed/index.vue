<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-layout>
                <v-flex xs12>
                    <InHero />
                </v-flex>
            </v-layout>
            <v-flex xs12>
                <InFeed :user-pages="userPages" :feeds="feedList" />
            </v-flex>
        </v-flex>
    </v-layout>
</template>

<script>
import InHero from '@/components/home/InHero'
import InFeed from '@/components/feed/Feed'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import scrollPage from '@/mixins/scrollPage'
import loadingFullScreen from '@/mixins/loadingFullScreen'
import scrollPageTo from '@/mixins/scrollPageTo'
export default {
    middleware: 'auth',
    components: {
        InHero,
        InFeed
    },
    mixins: [scrollPage, loadingFullScreen, scrollPageTo],
    data() {
        return {
            loadingFeed: false,
            hasNext: true,
            cachePage: 2
        }
    },
    computed: {
        ...mapGetters('auth', [
            'hasUserLogged',
            'userLogged',
            'userPagesList',
            'feedList',
            'loadMoreSuggestions'
        ]),
        ...mapGetters('app', ['scrollTop', 'scrollHeight', 'clientHeight']),
        percent() {
            const { scrollTop, scrollHeight, clientHeight } = this
            return parseInt((scrollTop / (scrollHeight - clientHeight)) * 100)
        }
    },
    watch: {
        userPagesList(val) {
            this.userPages = val
        },
        feedList(val) {
            this.feeds = val
        },
        percent(val) {
            if (
                val >= 90 &&
                !this.loadingFeed &&
                this.hasNext &&
                this.hasUserLogged
            ) {
                this.loadingFeed = true
                this.loadMoreFeeds()
            }
        }
    },
    async asyncData({
        store: { state, commit, dispatch },
        app: { $axios },
        env,
        error
    }) {
        try {
            const { feeds, suggestions, user } = await $axios.$get(
                '/user/feeds?loadMoreSuggestions=1&cachePage=1'
            )
            commit(
                'auth/SET_USER_SUGGESTION_FREQUENCY',
                env.userSuggestionFrequency
            )
            dispatch(
                'auth/setUser',
                Object.assign(JSON.parse(JSON.stringify(state.auth.user)), user)
            )
            return {
                categories: state.categories,
                pages: state.pages,
                userPages: state.auth.pages,
                feeds,
                suggestions
            }
        } catch (e) {
            error({
                statusCode: 500,
                message: 'Ocorreu um erro interno em nossos servidores'
            })
        }
    },
    beforeMount() {
        const { feeds, suggestions } = this
        const { commit } = this.$store
        commit('CLEAR_DATA_PAGE')
        commit('app/SET_TIMELINE', true)
        commit('app/SET_SHOW_EXTENDED_NAVBAR', false)
        if (suggestions) {
            this.setUserSuggestions(suggestions)
            this.setAllSuggestions(suggestions)
        }
        this.setUserFeeds(feeds)
        this.$nextTick(() => {
            this.scrollPageTo('app')
            this.setReady(false)
        })
    },
    destroyed() {
        this.$store.commit('app/SET_TIMELINE', false)
    },
    methods: {
        ...mapActions(['setReady']),
        ...mapActions('auth', ['setUserFeeds']),
        ...mapMutations('auth', {
            setUserSuggestions: 'SET_USER_SUGGESTIONS',
            setAllSuggestions: 'SET_ALL_SUGGESTIONS'
        }),
        async loadMoreFeeds() {
            this.loadingFeed = true
            try {
                const { feeds, suggestions } = await this.$axios.$get(
                    `/user/feeds?skip=${
                        this.feedList.filter(
                            ({ type }) => type !== 'suggestions'
                        ).length
                    }&loadMoreSuggestions=${
                        this.loadMoreSuggestions
                    }&cachePage=${this.cachePage}`
                )
                if (suggestions) {
                    this.setUserSuggestions(suggestions)
                    this.setAllSuggestions(suggestions)
                    this.cachePage += 1
                }
                this.hasNext = !!this.feeds.length
                const feedsList = [...this.feedList, ...feeds]
                this.setUserFeeds(feedsList)
            } catch (error) {
                this.$toast({
                    message: 'Erro no carregamento da timeline',
                    color: 'warning',
                    icon: 'warning'
                })
            }
            this.loadingFeed = false
        }
    }
}
</script>

<style></style>
