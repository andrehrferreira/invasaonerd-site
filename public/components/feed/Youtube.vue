<template>
    <v-card row wrap flat>
        <v-flex xs12>
            <p v-html="payload.title"></p>
        </v-flex>
        <v-flex v-if="playing === payload.id" xs12>
            <InEmbedView
                :auto-player="true"
                :video-id="payload.id"
                player-width="98%"
                :player-height="playerHeight"
                :is-playlist="false"
                type="youtube"
            />
        </v-flex>
        <v-flex v-else xs12>
            <v-hover>
                <v-card
                    slot-scope="{ hover }"
                    flat
                    :style="hover ? 'cursor: pointer;' : ''"
                    :href="'/post/' + feedId"
                    @click.prevent="$emit('play-video', payload.id)"
                >
                    <v-layout row wrap justify-center class="black">
                        <v-img
                            :src="checkImages(payload.thumbnails).url"
                            width="100%"
                            height="auto"
                            contain
                            :max-height="checkImages(payload.thumbnails).height"
                            :max-width="checkImages(payload.thumbnails).width"
                        >
                            <v-container
                                fluid
                                fill-height
                                :style="
                                    hover
                                        ? 'background-color: rgba(0,0,0,0.7)'
                                        : ''
                                "
                            >
                                <v-layout
                                    justify-center
                                    align-center
                                    fill-height
                                >
                                    <v-icon
                                        :color="hover ? 'red' : 'white'"
                                        size="70px"
                                        class="absolute_position"
                                        dark
                                        >play_arrow</v-icon
                                    >
                                </v-layout>
                            </v-container>
                        </v-img>
                    </v-layout>
                </v-card>
            </v-hover>
        </v-flex>
    </v-card>
</template>

<script>
import InEmbedView from '@/components/page/utils/EmbedView'
import { mapGetters } from 'vuex'
export default {
    components: {
        InEmbedView
    },
    props: {
        feedId: {
            type: String,
            required: true,
            default: ''
        },
        payload: {
            type: Object,
            required: true,
            default: () => {}
        },
        playing: {
            type: String,
            required: true,
            default: ''
        }
    },
    data() {
        return {
            player: {}
        }
    },
    computed: {
        ...mapGetters('app', ['scrollTop']),
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
        onReady() {
            this.player.playVideo()
        },

        checkImages(thumbs) {
            if (thumbs.high) return thumbs.high
            else if (thumbs.medium) return thumbs.medium
            else if (thumbs.default) return thumbs.default
            return {
                url: '/public/assets/img/avatardefault.jpeg',
                width: 200,
                height: 200
            }
        }
    }
}
</script>

<style></style>
