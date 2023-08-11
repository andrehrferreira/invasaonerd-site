<template>
    <v-layout row wrap class="in-suggestion-box pa-2">
        <v-flex xs12>
            <v-layout row justify-space-between>
                <p
                    :class="{
                        'display-1 mt-3 mb-0 ml-1': !isFeed,
                        title: isFeed
                    }"
                    v-text="inTitle"
                ></p>
                <v-layout row justify-end>
                    <v-tooltip :open-delay="50" :close-delay="50" bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                :loading="loading"
                                icon
                                class="ma-0"
                                v-on="on"
                                @click.prevent.stop="hideSuggestions"
                            >
                                <v-icon>visibility_off</v-icon>
                            </v-btn>
                        </template>
                        <span>Não ver mais Sugestões</span>
                    </v-tooltip>
                </v-layout>
            </v-layout>
        </v-flex>
        <v-flex xs12 class="pt-2">
            <v-layout row class="is-vertical">
                <InSwiper
                    ref="swiper"
                    :items="suggestions"
                    :slides-per-view="slidesPerView"
                    :height="context === 'feedSide' ? 85 : size"
                    :width="size"
                    :overflow="overflow"
                    :direction="vertical ? 'vertical' : 'horizontal'"
                    :mousewheel="vertical"
                    @next="onNext"
                >
                    <template v-slot:default="page">
                        <InPageItem
                            :page="page"
                            :height="context === 'feedSide' ? 85 : size"
                            :show-summary="false"
                            show-hide-suggestion-buttom
                            :no-hover="isFeed"
                            :is-mini="context === 'feedSide'"
                            @follow="onFollow"
                            @hide-suggestion="onHidePageSuggestion"
                        />
                    </template>
                </InSwiper>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
import InSwiper from '@/components/app/Swiper'
import InPageItem from '@/components/home/InPageItem'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
    components: {
        InSwiper,
        InPageItem
    },
    props: {
        inTitle: {
            type: String,
            default: 'Páginas Sugeridas'
        },
        suggestions: {
            type: Array,
            default: () => []
        },
        index: {
            type: Number,
            default: 0
        },
        slidesPerView: {
            type: Number,
            default: null
        },
        overflow: {
            type: String,
            default: 'hidden'
        },
        isFeed: Boolean,
        vertical: Boolean,
        context: {
            type: String,
            default: 'default'
        }
    },
    data() {
        return {
            loading: false,
            cachePage: 2
        }
    },
    computed: {
        ...mapState('auth', ['allSuggestions']),
        ...mapGetters('auth', ['userPagesList', 'feedList', 'userLogged']),

        size() {
            return this.isFeed ? 281 : 280
        }
    },
    watch: {
        suggestions(val) {
            if (
                (this.context === 'feedSide' || !this.isFeed) &&
                val.length < 10
            ) {
                this.loadMoreSuggestions()
            }
        }
    },
    methods: {
        ...mapMutations('auth', {
            setUserNoSuggestions: 'SET_USER_NO_SUGGESTIONS',
            setUserSuggestions: 'SET_USER_SUGGESTIONS',
            setAllSuggestions: 'SET_ALL_SUGGESTIONS',
            setUserFeeds: 'SET_USER_FEEDS'
        }),
        ...mapActions('auth', ['setUser']),

        onFollow({ following, pageId }) {
            if (following) {
                this.removeSuggestion(pageId)
            }
        },

        async onHidePageSuggestion(page) {
            this.loading = true
            try {
                const { data } = await this.$axios.post('/user/blacklistpage', {
                    _id: page._id,
                    id: page.id,
                    url: page.url
                })
                const user = this.$clearReactive(this.userLogged)
                user.blackListPages = data.data
                this.setUser(user)
                this.removeSuggestion(page.id)
            } catch (error) {
                this.$toast({
                    message: `Ocorreu um erro na comunicação com o servidor`,
                    color: 'red',
                    icon: 'warning'
                })
            }
            this.loading = false
        },

        async hideSuggestions() {
            this.loading = true
            if (this.context !== 'default') {
                try {
                    await this.$axios.post(
                        `/user/suggestion?context=${this.context}`
                    )
                    this.setUserNoSuggestions(this.context)
                } catch (error) {
                    this.$toast({
                        message: `Ocorreu um erro na comunicação com o servidor`,
                        color: 'red',
                        icon: 'warning'
                    })
                }
            }
            this.loading = false
        },

        removeSuggestion(pageId) {
            if (this.context === 'feedSide') {
                const feeds = this.$clearReactive(this.feedList).map(feed => {
                    if (feed.type === 'suggestions') {
                        feed.suggestions = feed.suggestions.filter(
                            ({ id }) => id !== pageId
                        )
                    }
                    return feed
                })
                this.setUserFeeds(feeds)
                this.setAllSuggestions(
                    this.allSuggestions.filter(({ id }) => id !== pageId)
                )
            }
            if (this.isFeed && this.context !== 'feedSide') {
                const feeds = this.$clearReactive(this.feedList)
                feeds[this.index].suggestions = feeds[
                    this.index
                ].suggestions.filter(({ id }) => id !== pageId)
                this.setUserFeeds(feeds)
                this.setAllSuggestions(
                    this.allSuggestions.filter(({ id }) => id !== pageId)
                )
            } else {
                this.setUserSuggestions(
                    this.suggestions.filter(({ id }) => id !== pageId)
                )
            }
        },

        onNext({ progress }) {
            if (
                (!this.isFeed || this.context === 'feedSide') &&
                progress >= 0.8 &&
                !this.loading
            ) {
                this.loadMoreSuggestions()
            }
        },

        async loadMoreSuggestions() {
            this.loading = true
            try {
                const { data } = await this.$axios.get(
                    `/user/suggestions?cachePage=${this.cachePage}`
                )
                this.cachePage += 1
                this.setUserSuggestions([
                    ...this.suggestions,
                    ...data.data.pages
                ])
                if (this.context === 'feedSide') {
                    this.setAllSuggestions([
                        ...this.allSuggestions,
                        ...data.data.pages
                    ])
                }
            } catch (error) {
                this.$toast({
                    message: `Ocorreu um erro na comunicação com o servidor`,
                    color: 'red',
                    icon: 'warning'
                })
            }
            this.loading = false
        }
    }
}
</script>

<style lang="scss" scoped>
.in-suggestion-box {
    .is-vertical {
        max-height: calc(100vh - 100px);
    }
}
</style>
