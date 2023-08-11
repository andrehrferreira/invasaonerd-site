<template>
    <v-card class="mb-2">
        <template v-if="feed.type === 'suggestions'">
            <InSuggestionsBox
                context="feedTimeline"
                :suggestions="feed.suggestions"
                :index="index"
                :slides-per-view="2"
                is-feed
            />
        </template>
        <template v-else>
            <v-card-title primary-title class="pa-2">
                <v-layout row wrap>
                    <v-flex xs2 sm1>
                        <v-layout row justify-center>
                            <a :href="'/page/' + feed.feeder.url">
                                <v-avatar size="40">
                                    <img
                                        :src="feed.photo"
                                        height="40"
                                        width="40"
                                        :alt="feed.feeder.title"
                                    />
                                </v-avatar>
                            </a>
                        </v-layout>
                    </v-flex>
                    <v-flex xs8 sm10>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <a :href="'/page/' + feed.feeder.url">
                                    <p class="mb-0 white--text">
                                        {{ feed.feeder.title }}
                                    </p>
                                </a>
                            </v-flex>
                            <v-flex xs12>
                                <p class="mb-0 caption grey--text">
                                    <a
                                        class="grey--text"
                                        :href="'/post/' + feed._id"
                                        >{{ formatType(feed) }}</a
                                    >
                                    -
                                    {{
                                        new Date(
                                            feed.publishedAt
                                        ).toLocaleString()
                                    }}
                                </p>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs2 sm1>
                        <v-layout row justify-end>
                            <v-menu transition="slide-x-transition" bottom left>
                                <v-btn slot="activator" dark icon>
                                    <v-icon>more_horiz</v-icon>
                                </v-btn>
                                <v-list>
                                    <v-list-tile
                                        :inactive="loading"
                                        @click.prevent.stop="
                                            followUnfollow(false)
                                        "
                                    >
                                        <v-list-tile-title>
                                            {{
                                                isFollow
                                                    ? 'Deixar de seguir'
                                                    : 'Seguir'
                                            }}
                                            {{ feed.feeder.title }}
                                        </v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-card-title>
            <v-card-text class="py-2">
                <div v-if="feed.type === 'instagram'">
                    <InInstagram
                        :feed-id="feed._id"
                        :payload="feed.payload"
                        :playing="playing"
                        @play-video="playVideo"
                    />
                </div>
                <div v-else-if="feed.type === 'youtube-video'">
                    <InYoutube
                        :feed-id="feed._id"
                        :payload="feed.payload"
                        :playing="playing"
                        @play-video="playVideo"
                    />
                </div>
            </v-card-text>
            <v-card-text class="py-0">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-layout row>
                            <v-flex xs4>
                                <v-layout row justify-center>
                                    <v-btn
                                        block
                                        outline
                                        small
                                        class="ma-0 in-no-border"
                                        :loading="loading"
                                        @click.prevent.stop="react()"
                                    >
                                        <p
                                            class="mb-0 caption hidden-xs-only text-truncate"
                                        >
                                            Curtir
                                        </p>
                                        <v-icon
                                            class="mx-2"
                                            :color="setColor"
                                            small
                                            >thumb_up_alt</v-icon
                                        >
                                        <span
                                            v-show="likes.length"
                                            class="caption mb-0 grey--text"
                                        >
                                            {{
                                                likes.length
                                                    ? $formatNumber(
                                                          likes.length
                                                      )
                                                    : ''
                                            }}
                                        </span>
                                    </v-btn>
                                </v-layout>
                            </v-flex>
                            <v-flex xs4>
                                <v-layout row justify-center>
                                    <v-btn
                                        block
                                        outline
                                        small
                                        class="ma-0 in-no-border"
                                        :disabled="commenting"
                                        @click.prevent.stop="
                                            toggleComment(!commenting)
                                        "
                                    >
                                        <p class="mb-0 caption hidden-xs-only">
                                            Comentar
                                        </p>
                                        <v-icon class="mx-2" small
                                            >chat_bubble_outline</v-icon
                                        >
                                        <span
                                            v-show="commentsCount"
                                            class="caption mb-0 grey--text"
                                            >{{
                                                $formatNumber(commentsCount)
                                            }}</span
                                        >
                                    </v-btn>
                                </v-layout>
                            </v-flex>
                            <v-flex xs4>
                                <v-layout row justify-center>
                                    <v-menu
                                        bottom
                                        left
                                        offset-x
                                        full-width
                                        style="width: 100%"
                                    >
                                        <v-btn
                                            slot="activator"
                                            block
                                            outline
                                            small
                                            class="ma-0 in-no-border"
                                            :loading="loading"
                                        >
                                            <p
                                                class="mb-0 caption hidden-xs-only text-truncate"
                                            >
                                                Compartilhar
                                            </p>
                                            <v-icon small class="mx-2"
                                                >share</v-icon
                                            >
                                            <span
                                                v-show="shares"
                                                class="caption mb-0 grey--text"
                                                >{{
                                                    $formatNumber(shares)
                                                }}</span
                                            >
                                        </v-btn>
                                        <v-list>
                                            <template
                                                v-for="linkShare in linksShare"
                                            >
                                                <v-list-tile
                                                    :key="linkShare.type"
                                                    avatar
                                                    rel="noopener"
                                                    target="_blank"
                                                    class="in-small-list"
                                                    @click.prevent.stop="
                                                        countShare(
                                                            linkShare.icon,
                                                            feed
                                                        )
                                                    "
                                                >
                                                    <v-list-tile-avatar>
                                                        <span
                                                            style="width: 25px; height: 25px;"
                                                            v-html="
                                                                icons[
                                                                    linkShare
                                                                        .icon
                                                                ]
                                                            "
                                                        ></span>
                                                    </v-list-tile-avatar>
                                                    <v-list-tile-content>
                                                        <v-list-tile-title>{{
                                                            linkShare.type
                                                        }}</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                            </template>
                                        </v-list>
                                    </v-menu>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 pa-1></v-flex>
                </v-layout>
                <template v-if="commenting">
                    <InCommentList
                        :feed-id="feed._id"
                        :comments-count="commentsCount"
                        @change-comments-count="commentsCountChange"
                    />
                </template>
            </v-card-text>
        </template>
    </v-card>
</template>

<script>
import InYoutube from './Youtube'
import InInstagram from './Instagram'
import InCommentList from '../comment/CommentList'
import InSuggestionsBox from '@/components/app/SuggestionsBox'
import { mapGetters, mapActions } from 'vuex'

export default {
    components: {
        InSuggestionsBox,
        InYoutube,
        InInstagram,
        InCommentList
    },
    props: {
        feed: {
            type: Object,
            required: true,
            default: () => {}
        },
        follow: {
            type: Boolean,
            required: false,
            default: false
        },
        playing: {
            type: String,
            required: true,
            default: ''
        },
        index: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            loading: false,
            likes: [],
            shares: 0,
            link: '',
            isFollow: false,
            linksShare: [
                {
                    type: 'Facebook',
                    icon: 'facebook'
                },
                {
                    type: 'WhatsApp',
                    icon: 'whatsapp'
                },
                {
                    type: 'Twitter',
                    icon: 'twitter'
                },
                {
                    type: 'Messenger',
                    icon: 'messenger'
                },
                {
                    type: 'Telegram',
                    icon: 'telegram'
                }
            ],
            commenting: false,
            commentsCount: 0
        }
    },

    computed: {
        ...mapGetters('auth', ['userLogged']),
        ...mapGetters({
            icons: 'app/getIcons'
        }),
        userId() {
            return this.userLogged.id
        },
        setColor() {
            if (this.likes && this.likes.some(like => like === this.userId))
                return 'primary'
            return 'white'
        }
    },
    beforeMount() {
        this.likes = JSON.parse(JSON.stringify(this.feed.likes || []))
        this.shares = JSON.parse(JSON.stringify(this.feed.shares || 0))
        this.isFollow = JSON.parse(JSON.stringify(this.follow || false))
        this.commentsCount = JSON.parse(
            JSON.stringify(this.feed.commentsCount || 0)
        )
    },

    methods: {
        ...mapActions('auth', [
            'setModalLogin',
            'setUserPages',
            'setExecutedFunctionAfterLogin',
            'setRedirectAfterLogin'
        ]),
        playVideo(videoId) {
            this.$emit('play-video', videoId)
        },
        openLink(type) {
            const link = window.location.origin + '/'
            const postId = this.feed._id
            switch (type) {
                case 'facebook':
                    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(
                        link + 'post/' + postId
                    )}`
                case 'whatsapp':
                    return `https://web.whatsapp.com/send?text=${link}post/${postId}`
                case 'twitter':
                    return `https://twitter.com/home?status=${link}post/${postId}`
                case 'messenger':
                    return `https://www.facebook.com/dialog/send?link=${encodeURI(
                        link + 'post/' + postId
                    )}&app_id=288306328656111&redirect_uri=${encodeURI(link)}`
                case 'telegram':
                    return `https://t.me/share/url?url=${encodeURI(
                        this.link
                    )}post/${postId}`
                default:
                    break
            }
        },
        formatType({ type, payload }) {
            if (type === 'youtube-video') {
                return 'Youtube Vídeo'
            } else if (type === 'instagram') {
                if (payload.type === 'GraphVideo') {
                    return 'Instagram Vídeo'
                } else if (payload.type === 'GraphImage') {
                    return 'Instagram Foto'
                } else if (payload.type === 'GraphSidecar') {
                    return 'Instagram Fotos'
                }
            }
        },
        async followUnfollow(isLogin = false) {
            const { feed } = this
            this.loading = true

            if (!this.userId) return this.verifyLogin(this.followUnfollow)

            if (this.isFollow && isLogin) return
            this.loading = true
            try {
                const { isFollow } = await this.$axios.$post('/user/follow', {
                    pageId: feed.idpage
                })
                this.isFollow = isFollow
                let userPages = await this.$axios.$get('/user/pages')
                userPages = userPages.sort(
                    (a, b) => b.notifications - a.notifications
                )
                this.setUserPages(userPages)
            } catch (error) {
                this.setModalLogin(false)
                this.$toast({
                    message: 'Falha na comunicação com o servidor',
                    color: 'red',
                    icon: 'warning'
                })
            }
            this.loading = false
        },
        async verifyLogin(fn) {
            const self = this
            this.setExecutedFunctionAfterLogin(async function() {
                self.setRedirectAfterLogin(null)
                await fn(true)
                self.setExecutedFunctionAfterLogin(null)
            })
            return this.setModalLogin(true)
        },
        react() {
            const { likes, userId } = this
            if (!this.userId) return this.verifyLogin(this.react)
            if (likes) {
                if (likes.some(like => like === userId)) {
                    return this.sendReact(false)
                }
            }
            this.sendReact(true, likes === undefined)
        },
        async sendReact(like, firstTime) {
            const { feed, userId } = this
            this.loading = true
            try {
                const data = await this.$axios.$post('/feed/react', {
                    feedId: feed._id,
                    like,
                    firstTime
                })
                if (data.status) {
                    if (firstTime) {
                        this.likes = [userId]
                    } else if (like) {
                        this.likes.push(userId)
                    } else {
                        this.likes = this.likes.filter(like => like !== userId)
                    }
                }
            } catch (err) {
                this.$toast({
                    message: 'Falha na comunicação com o servidor',
                    color: 'red',
                    icon: 'warning'
                })
            }
            this.loading = false
        },
        async countShare(type, feed) {
            const link = this.openLink(type)
            if (!link) return
            window.open(link, '_blank')
            this.loading = true
            try {
                await this.$axios.$post('/feed/share', {
                    feedId: feed._id
                })
                if (this.shares !== undefined) this.shares += 1
                else this.shares = 1
            } catch (err) {
                this.$toast({
                    message: 'Falha na comunicação com o servidor',
                    color: 'red',
                    icon: 'warning'
                })
            }
            this.loading = false
        },
        toggleComment(val) {
            if (!this.userId) return this.verifyLogin(this.followUnfollow)
            this.commenting = val
        },
        commentsCountChange(val) {
            this.commentsCount += val
        }
    }
}
</script>

<style scoped>
a {
    color: #fff;
    text-decoration: none;
}
div.emoji-mart-category-label > span {
    background-color: #414141 !important;
    border-radius: 20px;
}

.emoji-mart {
    color: white !important;
    background-color: #515151 !important;
}

span.emoji-mart-emoji > span {
    cursor: pointer !important;
}

.emoji-mart-anchor:hover {
    color: white !important;
    cursor: pointer !important;
}

.emoji-mart-anchor.emoji-mart-anchor-selected {
    color: #67ff6d !important;
}

.emoji-mart-anchor-bar {
    background-color: #67ff6d !important;
}
.list-item {
    display: inline-block;
    margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
    transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active em versões anteriores a 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
}
.in-small-list > .v-list__tile {
    height: 35px !important;
}
.in-no-border.v-btn.v-btn--outline {
    border: none !important;
}
</style>
