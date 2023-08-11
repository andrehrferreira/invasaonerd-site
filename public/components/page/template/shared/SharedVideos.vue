<template>
    <v-layout row wrap grid-list-lg fluid>
        <v-flex xs12>
            <template v-if="videoId">
                <InVideoView
                    :video-id="videoId"
                    type="youtube"
                    :is-playlist="isPlaylist"
                    :player-height="playerHeight"
                    @close="stop"
                />
            </template>
        </v-flex>
        <template v-if="isMain">
            <InSwiper :items="videos" :height="250" :width="240">
                <template v-slot:default="video">
                    <InVideoItem :video="video" @toPlay="play(video)" />
                </template>
            </InSwiper>
        </template>
        <template v-else>
            <v-layout row wrap>
                <v-flex
                    v-for="(video, index) in videos"
                    :key="index"
                    xs12
                    md4
                    lg3
                    xl2
                >
                    <v-hover>
                        <template slot-scope="{ hover }">
                            <InVideoItem
                                :hover="hover"
                                :video="video"
                                @toPlay="play(video)"
                            />
                        </template>
                    </v-hover>
                </v-flex>
            </v-layout>
        </template>
    </v-layout>
</template>

<script>
import scrollPageTo from '@/mixins/scrollPageTo'
import InVideoItem from './SharedVideoItem'
import InSwiper from '@/components/app/Swiper'
import InVideoView from '@/components/page/utils/VideoView'

export default {
    components: {
        InVideoItem,
        InSwiper,
        InVideoView
    },
    mixins: [scrollPageTo],
    props: {
        videos: {
            type: Array,
            required: true,
            default: () => []
        },
        isMain: {
            type: Boolean,
            required: false,
            dafault: true
        },
        isPlaylist: {
            type: Boolean,
            required: false,
            dafault: false
        },
        scroll: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            videoId: null
        }
    },
    computed: {
        // eslint-disable-next-line vue/return-in-computed-property
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
    methods: {
        play(video) {
            this.videoId = null
            this.videoId = video.id
            if (this.scroll)
                setTimeout(() => {
                    this.scrollPageTo(video.id)
                }, 100)
        },
        stop() {
            this.videoId = null
        }
    }
}
</script>
