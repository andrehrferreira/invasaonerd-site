<template>
    <v-container :style="styles" class="main" :fluid="lgAndDown">
        <div v-if="page.removed" :class="{ 'page-removed': page.removed }">
            <p class="display-4 font-weight-regular">Página Removida</p>
        </div>

        <template v-if="pageLoading.active">
            <div class="in-page-loading">
                <InLoading
                    :svg="icons[pageLoading.icon]"
                    :text="pageLoading.text"
                />
            </div>
        </template>
        <InCover :cover="page.cover" :alt="'Cover da página ' + page.title">
            <template v-show="hasSocialLinks" v-slot:social-links>
                <InSocialLinks v-bind="socialLinks" />
            </template>
        </InCover>
        <template v-if="editingType !== 'cover'">
            <InBodyPage :page="page">
                <template v-slot:side-order>
                    <InSideOrder :side-order="sideOrder" :page="page" />
                </template>
                <template v-slot:main>
                    <InMainPage :page="page" />
                </template>
            </InBodyPage>
        </template>
        <template v-if="isActiveBoxEditor">
            <InBoxEditor />
        </template>
        <template v-if="isActiveBasicInfo">
            <InBasicInfoModal fab />
        </template>
        <InModalPageDelete />
        <slot name="floating"></slot>
    </v-container>
</template>

<script>
import loadingFullScreen from '@/mixins/loadingFullScreen'
import InCover from '@/components/page/template/cover/Cover'
import InSocialLinks from '@/components/page/SocialLinks'
import InBodyPage from '@/components/page/BodyPage'
import InMainPage from '@/components/page/MainPage'
import InSideOrder from '@/components/page/SideOrder'
import InBoxEditor from '@/components/page/template/box/Box'
import InBasicInfoModal from '@/components/page/template/basicInfo/BasicInfoModal'
import InLoading from '@/components/app/Loading'
import InModalPageDelete from '@/components/page/ModalPageDelete'
import { mapGetters } from 'vuex'
export default {
    components: {
        InCover,
        InSocialLinks,
        InBodyPage,
        InSideOrder,
        InMainPage,
        InBoxEditor,
        InBasicInfoModal,
        InLoading,
        InModalPageDelete
    },

    mixins: [loadingFullScreen],
    props: {
        orderItem: {
            type: Object,
            required: true,
            default: () => {}
        },

        pageItem: {
            type: Object,
            required: true,
            default: () => {}
        },

        showChanges: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data() {
        return {
            page: Object.assign({}, this.pageItem),
            order: Object.assign({}, this.order)
        }
    },

    computed: {
        ...mapGetters('page', [
            'editingType',
            'isActiveBoxEditor',
            'isActiveBasicInfo',
            'pageLoading'
        ]),
        ...mapGetters({
            icons: 'app/getIcons',
            isReady: 'isReady'
        }),
        sideOrder() {
            const { sideOrder } = this.order
            return sideOrder
        },

        mainOrder() {
            const { mainOrder } = this.order
            return mainOrder
        },

        lgAndDown() {
            const {
                breakpoint: { lgAndDown }
            } = this.$vuetify
            return lgAndDown
        },

        hasSocialLinks() {
            const { page } = this
            if (page.website && page.website.url) return true
            if (page.youtube && page.youtube.url) return true
            if (page.facebook && page.facebook.url) return true
            if (page.instagram && page.instagram.url) return true
            if (page.twitter && page.twitter.url) return true
            if (page.spotify && page.spotify.url) return true
            return false
        },

        socialLinks() {
            const {
                page: {
                    facebook,
                    instagram,
                    twitter,
                    spotify,
                    website,
                    youtube
                }
            } = this
            const social = {
                facebook: facebook ? facebook.url : null,
                instagram: instagram ? instagram.url : null,
                twitter: twitter ? twitter.url : null,
                spotify: spotify ? spotify.url : null,
                youtube: youtube ? youtube.url : null,
                website:
                    website && Object.keys(website).length
                        ? {
                              url: website.url,
                              src: website.icon,
                              title: website.title,
                              alt: 'Website'
                          }
                        : null
            }
            return social
        },

        styles() {
            return {
                display: this.isReady ? 'none' : 'block',
                backgroudColor: this.page.removed ? 'red' : ''
            }
        }
    },
    watch: {
        pageItem() {
            this.page = Object.assign({}, this.pageItem)
        },
        orderItem() {
            this.order = Object.assign({}, this.orderItem)
        },
        showChanges(val) {
            val && this.showChangesFn()
        }
    },

    methods: {
        showChangesFn() {
            if (!this.page.changes) return
            var aux = true
            let changes = []
            this.page.changes
                .filter(({ action }) => action != 'remove')
                .filter(change => {
                    if (changes.every(({ type }) => type != change.type)) {
                        changes.push(change)
                    }
                })
            changes.map(change => {
                const { type } = change
                if (type) {
                    const element = document.getElementById(type)
                    if (!element && type != 'youtube') return
                    if (
                        type === 'website' ||
                        type === 'facebook' ||
                        type === 'instagram' ||
                        type === 'twitter' ||
                        type === 'spotify'
                    ) {
                        if (aux) {
                            this.divChange(
                                document.getElementById('basic-info'),
                                '10px'
                            )
                            aux = false
                        }
                    }
                    if (type === 'wiki') {
                        document.querySelectorAll('#wiki').forEach(elem => {
                            this.divChange(elem)
                        })
                    } else if (type === 'youtube') {
                        const videos = document.getElementById('videos')
                        this.divChange(videos)
                        const playlists = document.getElementById('playlists')
                        this.divChange(playlists)
                    } else if (element) {
                        this.divChange(element)
                    }
                }
            })
        },

        divChange(element, padding) {
            if (element) {
                if (padding) element.style.padding = padding
                element.classList.add('change-animated')
            }
        }
    }
}
</script>

<style scoped>
.in-page-loading {
    z-index: 9999;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.7);
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
}
.page-removed {
    z-index: 61;
    position: fixed;
    background-color: rgba(239, 0, 28, 0.5);
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
}
</style>

<style>
.change-animated {
    border-radius: 5px;
    border: 2px solid yellow;
    animation: shadow-pulse 1s infinite;
}
.change-animated:hover {
    animation: none;
}

@keyframes shadow-pulse {
    0% {
        box-shadow: 0 0 0 0px rgba(255, 255, 0, 0.2);
    }
    100% {
        box-shadow: 0 0 0 35px rgba(0, 0, 0, 0);
    }
}
</style>
