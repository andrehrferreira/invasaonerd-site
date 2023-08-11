<template>
    <section id="contents">
        <InTab :scroll="false" :is-main="true" @change-key="key = $event">
            <v-tabs-items v-model="active" dark touchless>
                <v-tab-item :key="`#in-tab-main`">
                    <template v-if="page.wiki || editingType == 'wiki'">
                        <InSummary :wiki="page.wiki || {}" />
                    </template>
                    <div
                        v-for="comp in mainList"
                        :key="`#in-content-${comp.title.toLowerCase()}`"
                    >
                        <div class="margin-in-page"></div>
                        <keep-alive>
                            <component
                                :is="comp.component"
                                v-bind="comp.props"
                                :is-main="true"
                            />
                        </keep-alive>
                        <div class="margin-in-page"></div>
                    </div>
                </v-tab-item>
                <v-tab-item
                    v-for="item in items"
                    :key="`#in-tab-${item.title.toLowerCase()}`"
                    ripple
                >
                    <keep-alive>
                        <component
                            :is="item.component"
                            :key="`#in-comp-${item.title.toLowerCase()}`"
                            :tab="key"
                            v-bind="item.props"
                        />
                    </keep-alive>
                </v-tab-item>
            </v-tabs-items>
        </InTab>
    </section>
</template>

<script>
import InInstagram from './template/instagram/Instagram'
import InBook from './template/book/Book'
import InVideos from './template/video/Videos'
import InVideoFeatured from './template/video/VideoFeatured'
import InChannel from './template/channel/Channel'
import InLives from './template/lives/Lives'
import InSummary from './template/summary/Summary'
import InSeries from './template/series/Series'
import InMovies from './template/movies/Movies'
import InGames from './template/games/Games'
import InFeeds from './template/feeds/Feeds'
import InTab from './Tabs'
import pageTabs from '@/mixins/pageTabs'
import { mapGetters, mapActions } from 'vuex'
export default {
    components: {
        InInstagram,
        InBook,
        InVideos,
        InChannel,
        InLives,
        InSummary,
        InSeries,
        InMovies,
        InGames,
        InVideoFeatured,
        InFeeds,
        InTab
    },
    mixins: [pageTabs],
    props: {
        page: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    data() {
        return {
            active: 0,
            key: 0
        }
    },
    computed: {
        ...mapGetters('page', ['activeTab']),
        mainList() {
            return this.items
                .filter(i => !i.notMain)
                .sort((a, b) => a.order - b.order)
        }
    },
    watch: {
        activeTab(val) {
            this.active != val ? (this.active = val) : null
        },
        active(val) {
            this.activeTab != val && this.setActiveTab(val)
        }
    },
    methods: {
        ...mapActions('page', ['setActiveTab'])
    }
}
</script>

<style scoped>
.margin-in-page {
    width: 100%;
    position: relative;
    height: 0px;
    border-bottom: 1px solid black;
    -webkit-box-shadow: 0px 0px 1px 1px rgba(64, 64, 64, 1);
    -moz-box-shadow: 0px 0px 1px 1px rgba(64, 64, 64, 1);
    box-shadow: 0px 0px 1px 1px rgba(64, 64, 64, 1);
}
</style>
