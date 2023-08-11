<template>
    <v-container
        :fluid="bp.mdAndDown"
        class="in-feed py-2 px-0"
        :style="styles"
    >
        <v-layout row nowrap justify-center>
            <v-flex
                v-show="bp.mdAndUp && hasUserLogged"
                style="position: relative;"
                xs3
                xl2
                fill-height
            >
                <v-card ref="user" class="mr-2">
                    <v-flex xs12>
                        <InUserCard :user="userLogged" :styles="stylesUser" />
                    </v-flex>
                </v-card>
                <template v-if="userPages.length">
                    <InUserPages :pages="userPages" :styles="stylesUserPages" />
                </template>
            </v-flex>
            <v-flex xs12 sm8 md6 xl6>
                <InTimeline :feeds="feeds" :pages="userPages.map(u => u.id)" />
            </v-flex>
            <v-flex
                v-show="
                    bp.lgAndUp &&
                        hasUserLogged &&
                        !noSuggestions.includes('feedSide')
                "
                class="right-box"
                xs3
                xl2
                fill-height
            >
                <v-layout row class="in-suggestions" :class="[scrollFixed]">
                    <InSuggestionsBox
                        context="feedSide"
                        :suggestions="allSuggestions"
                        is-feed
                        vertical
                    />
                </v-layout>
            </v-flex>
        </v-layout>
        <v-fab-transition>
            <v-btn
                v-show="backToTop"
                :large="bp.lgAndUp"
                :small="bp.xs"
                color="#ef001c"
                dark
                fixed
                bottom
                right
                fab
                @click.stop="scrollPageTo('app')"
            >
                <v-icon :large="bp.lgAndUp" :small="bp.xs">expand_less</v-icon>
            </v-btn>
        </v-fab-transition>
    </v-container>
</template>

<script>
import InSuggestionsBox from '@/components/app/SuggestionsBox'
import scrollPageTo from '@/mixins/scrollPageTo'
import InUserCard from '../user/UserCard'
import InUserPages from './UserPages'
import InTimeline from './Timeline'
import { mapGetters, mapState } from 'vuex'

export default {
    components: {
        InSuggestionsBox,
        InUserCard,
        InUserPages,
        InTimeline
    },
    mixins: [scrollPageTo],
    props: {
        userPages: {
            type: Array,
            required: true,
            default: () => []
        },
        feeds: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    computed: {
        ...mapState('auth', ['allSuggestions', 'user', 'noSuggestions']),
        ...mapGetters('auth', ['hasUserLogged', 'userLogged']),
        ...mapGetters('app', ['scrollTop', 'scrollHeight', 'clientHeight']),
        ...mapGetters(['isReady']),
        bp() {
            const { breakpoint } = this.$vuetify
            return breakpoint || {}
        },
        height() {
            return this.bp.height
        },
        stylesUserPages() {
            const { height } = this
            if (this.scrollTop > height - height / 2 && !this.isReady) {
                const { user } = this.$refs
                let userWidth = user ? user.$el.clientWidth : '300'
                return {
                    maxHeight: `${height - 180}px`,
                    overflowY: 'auto',
                    top: '160px',
                    position: 'fixed',
                    width: `${userWidth}px`
                }
            } else {
                return {
                    maxHeight: `${height - 180}px`,
                    overflowY: 'auto'
                }
            }
        },
        stylesUser() {
            const { height } = this
            if (this.scrollTop > height - height / 2 && !this.isReady) {
                const { user } = this.$refs
                let userWidth = user ? user.$el.clientWidth : '300'
                return {
                    maxHeight: `${height - 180}px`,
                    top: '68px',
                    position: 'fixed',
                    width: `${userWidth}px`
                }
            } else {
                return {}
            }
        },
        backToTop() {
            return this.scrollTop > this.clientHeight
        },
        styles() {
            return {
                display: this.isReady ? 'none' : 'block'
            }
        },
        scrollFixed() {
            const { height } = this
            if (this.scrollTop > height - height / 2 && !this.isReady) {
                return 'in-fixed'
            }
            return ''
        }
    }
}
</script>

<style lang="scss" scoped>
.in-feed {
    .right-box {
        max-width: 281px;
        position: relative;
        max-width: 281px;
        .in-suggestions {
            &.in-fixed {
                max-width: 281px;
                position: fixed;
                top: 60px;
            }
        }
    }
}
</style>
