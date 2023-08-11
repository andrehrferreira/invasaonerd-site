<template>
    <v-layout row wrap>
        <v-flex v-for="(feed, index) in feeds" :key="feed._id" xs12>
            <InFeedItem
                v-if="
                    feed.type !== 'suggestions' ||
                        (feed.type === 'suggestions' &&
                            !noSuggestions.includes('feedTimeline') &&
                            feed.suggestions.length)
                "
                :feed="feed"
                :follow="pages.includes(feed.idpage)"
                :playing="playing"
                :index="index"
                @play-video="playVideo"
            />
        </v-flex>
    </v-layout>
</template>

<script>
import InFeedItem from './FeedItem'
import { mapState } from 'vuex'
export default {
    components: {
        InFeedItem
    },
    props: {
        feeds: {
            type: Array,
            required: true,
            default: () => []
        },
        pages: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    data() {
        return {
            playing: ''
        }
    },
    computed: {
        ...mapState('auth', ['noSuggestions'])
    },
    methods: {
        playVideo(videoId) {
            this.playing = videoId
        }
    }
}
</script>
