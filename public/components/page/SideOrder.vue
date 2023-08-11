<template>
    <v-layout row wrap>
        <v-flex
            v-for="(item, index) in componentsSideOrder"
            :key="index"
            xs12
            :text-xs-center="item.isCenter"
        >
            <keep-alive>
                <component :is="item.component" v-bind="item.props" />
            </keep-alive>
        </v-flex>
    </v-layout>
</template>

<script>
import InFacebook from './template/facebook/Facebook'
import InTwitter from './template/twitter/Twitter'
import InSpotify from './template/spotify/Spotify'
import InFullInfo from './template/fullInfo/FullInfo'
import InFeaturedPages from './template/featuredPages/FeaturedPages'
import { mapGetters } from 'vuex'
export default {
    components: {
        InFacebook,
        InTwitter,
        InSpotify,
        InFullInfo,
        InFeaturedPages
    },
    props: {
        sideOrder: {
            type: Array,
            required: true,
            default: () => []
        },
        page: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters('page', ['editingType']),
        componentsSideOrder() {
            const options = [
                {
                    component: 'InFacebook',
                    type: 'facebook',
                    props: {
                        url: this.page.facebook ? this.page.facebook.url : ''
                    },
                    isShow: !!this.page.facebook,
                    isCenter: true,
                    order: this.sideOrder.indexOf('facebook')
                },
                {
                    component: 'InTwitter',
                    type: 'twitter',
                    props: {
                        url: this.page.twitter ? this.page.twitter.url : '',
                        title: this.page.title
                    },
                    isShow: this.page.twitter && this.page.twitter.embbed,
                    isCenter: true,
                    order: this.sideOrder.indexOf('facebook')
                },
                {
                    component: 'InSpotify',
                    type: 'spotify',
                    props: {
                        url: this.page.spotify ? this.page.spotify.url : ''
                    },
                    isShow: !!this.page.spotify,
                    isCenter: true,
                    order: this.sideOrder.indexOf('spotify')
                },
                {
                    component: 'InFullInfo',
                    type: 'wiki',
                    props: {
                        fullinfo: this.page.wiki ? this.page.wiki.fullinfo : {}
                    },
                    isShow: !!this.page.wiki,
                    isCenter: false,
                    order: this.sideOrder.indexOf('wiki')
                },
                {
                    component: 'InFeaturedPages',
                    type: 'featuredPages',
                    props: {
                        featuredPages: this.page.featuredPages
                            ? this.page.featuredPages
                            : []
                    },
                    isShow:
                        !!this.page.featuredPages ||
                        this.editingType == 'featuredPages',
                    isCenter: false,
                    order: this.sideOrder.indexOf('featuredPages')
                }
            ]
            return options
                .filter(o => o.isShow)
                .sort((a, b) => a.order - b.order)
        }
    }
}
</script>

<style></style>
