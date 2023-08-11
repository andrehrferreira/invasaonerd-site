<template>
    <InPageContainer
        type="lives"
        title="Lives"
        show-button-bottom
        show-delete
        show-edit
    >
        <template v-if="videoId">
            <v-layout row wrap>
                <InVideoView :video-id="videoId" type="live" @close="stop" />
            </v-layout>
        </template>
        <template v-if="isMain">
            <InSwiper :items="streams" :height="250" :width="240">
                <template v-slot:default="stream">
                    <InLiveItem :stream="stream" @toPlay="play(stream)" />
                </template>
            </InSwiper>
        </template>
        <template v-else>
            <InPageContent>
                <v-flex
                    v-for="(stream, index) in streams"
                    :key="index"
                    xs12
                    md4
                    lg3
                    xl2
                >
                    <v-hover>
                        <template slot-scope="{ hover }">
                            <InLiveItem
                                :hover="hover"
                                :stream="stream"
                                @toPlay="play(stream)"
                            />
                        </template>
                    </v-hover>
                </v-flex>
            </InPageContent>
        </template>
        <template v-slot:edit>
            <InEditorLives :streams="streams"
        /></template>
    </InPageContainer>
</template>

<script>
import InPageContent from '@/components/page/utils/PageContent'
import InPageContainer from '@/components/page/utils/PageContainer'
import InVideoView from '@/components/page/utils/VideoView'
import InSwiper from '@/components/app/Swiper'
import pageEdit from '@/mixins/pageEdit'
import InLiveItem from './LiveItem'
import InEditorLives from './EditorLives'
import scrollPageTo from '@/mixins/scrollPageTo'
export default {
    components: {
        InPageContent,
        InPageContainer,
        InLiveItem,
        InVideoView,
        InSwiper,
        InEditorLives
    },
    mixins: [pageEdit, scrollPageTo],
    props: {
        streams: {
            type: Array,
            required: true,
            default: () => []
        },
        isMain: {
            type: Boolean,
            required: false,
            dafault: true
        }
    },
    data() {
        return {
            videoId: null
        }
    },
    methods: {
        play(live) {
            this.videoId = null
            this.videoId = live.channel.name
            setTimeout(() => {
                this.scrollPageTo(live.channel.name)
            }, 100)
        },
        stop() {
            this.videoId = null
        }
    }
}
</script>

<style></style>
