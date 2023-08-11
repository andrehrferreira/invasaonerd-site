<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-layout>
                <v-flex xs12>
                    <InHero />
                </v-flex>
            </v-layout>
            <v-flex xs12>
                <InFeed :user-pages="userPages" :feeds="feeds" />
            </v-flex>
        </v-flex>
    </v-layout>
</template>

<script>
import InHero from '@/components/home/InHero'
import InFeed from '@/components/feed/Feed'
import { mapGetters, mapActions } from 'vuex'
import scrollPage from '@/mixins/scrollPage'
import loadingFullScreen from '@/mixins/loadingFullScreen'
import head from '@/mixins/head'

export default {
    components: {
        InHero,
        InFeed
    },
    mixins: [scrollPage, loadingFullScreen, head],

    computed: {
        ...mapGetters('auth', ['hasUserLogged', 'userLogged', 'userPagesList'])
    },
    watch: {
        userPagesList(val) {
            this.userPages = val
        }
    },
    async asyncData({ params: { postId }, app: { $axios }, error }) {
        try {
            let userPages = []
            const feed = await $axios.$get(`/feed/post/${postId}`)
            return {
                userPages,
                feeds: [feed],
                isFeed: true,
                metatags: feed.metatags
            }
        } catch (e) {
            error({ statusCode: 404, message: 'Página não encontrada' })
        }
    },
    beforeMount() {
        const { isFeed } = this
        const { commit } = this.$store
        commit('CLEAR_DATA_PAGE')
        commit('app/SET_TIMELINE', true)
        commit('app/SET_SHOW_EXTENDED_NAVBAR', isFeed)
        this.$nextTick(() => {
            this.scrollPageTo('app')
            this.setReady(false)
        })
    },
    methods: {
        ...mapActions(['setReady'])
    }
}
</script>

<style></style>
