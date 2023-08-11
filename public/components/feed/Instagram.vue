<template>
    <v-layout row wrap>
        <v-flex v-if="instagram.accessibility_caption" xs12>
            <p v-html="$urlify(instagram.accessibility_caption)"></p>
        </v-flex>
        <v-flex xs12>
            <v-layout
                v-if="
                    instagram.type === 'GraphImage' ||
                        instagram.type === 'GraphVideo'
                "
                row
                class="black"
            >
                <v-flex v-if="playing !== instagram.shortcode" xs12>
                    <v-layout row align-center justify-center>
                        <v-hover>
                            <v-img
                                slot-scope="{ hover }"
                                cover
                                :alt="instagram.accessibility_caption"
                                :style="hover ? 'cursor: pointer;' : ''"
                                :height="
                                    instagram.thumbnail_resources[bp.lg ? 3 : 2]
                                        .config_height
                                "
                                :width="
                                    instagram.thumbnail_resources[bp.lg ? 3 : 2]
                                        .config_width
                                "
                                :src="
                                    instagram.thumbnail_resources[bp.lg ? 3 : 2]
                                        .src
                                "
                                :lazy-src="instagram.thumbnail_resources[1].src"
                                :max-height="
                                    instagram.thumbnail_resources[bp.lg ? 3 : 2]
                                        .config_height
                                "
                                :max-width="
                                    instagram.thumbnail_resources[bp.lg ? 3 : 2]
                                        .config_width
                                "
                                @error="removeFromFeed($event)"
                                @click.stop="open(instagram.shortcode)"
                            >
                                <v-container
                                    v-if="instagram.type === 'GraphVideo'"
                                    fluid
                                    fill-height
                                    :style="
                                        hover
                                            ? 'background-color: rgba(0,0,0,0.7)'
                                            : ''
                                    "
                                    @click.stop="
                                        $emit('play-video', instagram.shortcode)
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
                        </v-hover>
                    </v-layout>
                </v-flex>
                <v-flex v-else xs12>
                    <video
                        autoplay
                        :style="{ width: '100%' }"
                        controls
                        :poster="instagram.media.display_url"
                        preload="metadata"
                    >
                        <source
                            :src="instagram.media.video_url"
                            type="video/mp4"
                        />
                        O seu browser não suporta a reprodução deste vídeo.
                    </video>
                </v-flex>
            </v-layout>
            <v-layout
                v-else-if="instagram.type === 'GraphSidecar'"
                align-center
                justify-center
                class="black"
            >
                <v-flex v-if="loading" xs12>
                    <InLoading />
                </v-flex>

                <v-carousel :cycle="false">
                    <v-carousel-item
                        v-for="(node, index) in instagram.media.sidecar"
                        :key="index"
                    >
                        <in-image
                            :height="bp.mdAndUp ? 600 : '500'"
                            contain
                            :src="node.display_url"
                            :alt="
                                node.accessibility_caption || node.display_url
                            "
                        ></in-image>
                    </v-carousel-item>
                </v-carousel>
            </v-layout>
        </v-flex>
        <v-dialog v-model="dialog" max-width="935">
            <InstagramMedia
                :url="midiaLink"
                :instagram="payload"
                @close-modal="close"
            />
        </v-dialog>
    </v-layout>
</template>

<script>
import InLoading from '@/components/app/Loading.vue'
import InstagramMedia from '@/components/page/template/instagram/InstagramMedia'
export default {
    components: {
        InLoading,
        InstagramMedia
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
            instagram: Object.assign({}, this.payload),
            loading: false,
            error: false,
            midiaLink: '',
            dialog: false
        }
    },
    computed: {
        bp() {
            return this.$vuetify.breakpoint || {}
        }
    },
    methods: {
        removeFromFeed() {
            this.instagram.display_url = this.instagram.media.display_url
        },
        open(shortcode) {
            this.dialog = true
            this.midiaLink = shortcode
        },
        close() {
            this.dialog = false
            this.midiaLink = ''
        }
    }
}
</script>

<style>
a {
    color: gray;
    text-decoration: none;
}
</style>
