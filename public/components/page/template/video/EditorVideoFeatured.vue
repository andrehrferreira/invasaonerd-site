<template>
    <PageEditorContainer
        type="featuredVideo"
        title="Vídeo em Destaque "
        :height="260"
        :width="120"
        @save="save"
    >
        <template v-if="featuredVideoLocal.id">
            <InEmbedView
                :id="featuredVideoLocal.id"
                :video-id="featuredVideoLocal.id"
                player-width="98%"
                :player-height="playerHeight"
                :is-playlist="false"
                type="youtube"
                :auto-player="false"
            />
        </template>
        <InPageSearch
            title="Vídeos"
            :loading="loading"
            :empty="empty"
            :search="search"
            @search="getVideosList"
        >
            <v-layout row wrap grid-list-lg fluid>
                <v-flex
                    v-for="(video, index) in videosList"
                    :key="index"
                    xs12
                    md4
                    lg3
                    xl2
                    pa-2
                >
                    <v-hover>
                        <template slot-scope="{ hover }">
                            <InVideoItem
                                :hover="hover"
                                :video="video"
                                @toPlay="selectItem(video)"
                            />
                        </template>
                    </v-hover>
                </v-flex>
            </v-layout>
        </InPageSearch>
    </PageEditorContainer>
</template>

<script>
import { mapGetters } from 'vuex'
import pageEdit from '@/mixins/pageEdit'
import PageEditorContainer from '@/components/page/utils/PageEditorContainer'
import InPageSearch from '@/components/page/utils/PageSearch'
import InEmbedView from '@/components/page/utils/EmbedView'
import InVideoItem from '../shared/SharedVideoItem'
import scrollPageTo from '@/mixins/scrollPageTo'
export default {
    components: {
        PageEditorContainer,
        InPageSearch,
        InEmbedView,
        InVideoItem
    },
    mixins: [pageEdit, scrollPageTo],
    props: {
        featuredVideo: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    data() {
        return {
            videosList: [],
            featuredVideoLocal: Object.assign({}, this.featuredVideo),
            loading: false,
            error: false,
            search: '',
            empty: false
        }
    },
    computed: {
        ...mapGetters({
            page: 'getPage'
        }),
        playerHeight() {
            const { $breakpoint } = this
            if ($breakpoint)
                switch ($breakpoint.name) {
                    case 'xs':
                        return '220px'
                    case 'sm':
                        return '300px'
                    case 'md':
                    case 'lg':
                    case 'xl':
                        return '500px'
                }
            return '500px'
        }
    },
    watch: {
        page(val) {
            if (val && val.title) this.search = val.title
        }
    },
    beforeMount() {
        this.search = this.page.title
        this.getVideosList(this.search, true)
    },
    methods: {
        async getVideosList(search, force = false) {
            if (
                search &&
                (force || this.search.toLowerCase() != search.toLowerCase())
            ) {
                this.empty = false
                this.loading = true
                this.search = search
                try {
                    const data = await this.$axios.$get(
                        `youtube/videos?search=${encodeURIComponent(
                            this.search
                        )}`
                    )
                    this.videosList = data.filter(
                        video => !(this.featuredVideoLocal.id == video.id)
                    )
                    this.loading = false
                } catch (error) {
                    this.loading = false
                    this.error = true
                }
            } else if (search == '') {
                this.empty = true
            }
        },
        selectItem(video) {
            this.featuredVideoLocal = null
            this.featuredVideoLocal = video
            this.empty = false
            setTimeout(() => {
                this.scrollPageTo(video.id)
            }, 100)
        },
        save() {
            this.changes = {
                type: 'featuredVideo',
                action: 'update'
            }
            this.pageChange = {
                featuredVideo: this.featuredVideoLocal
            }
            this.saveStore()
            this.$toast({
                message: `Edições do Vídeo em Destaque gravadas para envio`,
                color: 'success',
                icon: 'check-circle'
            })
        }
    }
}
</script>

<style scoped>
.v-card {
    border-radius: 5px;
}

hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #666;
    margin: 1em 0;
    padding: 0;
}
</style>
