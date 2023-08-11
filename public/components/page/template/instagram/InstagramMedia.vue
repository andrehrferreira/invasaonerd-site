<template>
    <v-card dark :style="loading ? '' : bp.mdAndUp ? 'min-height: 450px;' : ''">
        <template v-if="loading">
            <InLoading />
        </template>
        <template v-else-if="!error">
            <v-layout row wrap>
                <v-flex xs12 md8>
                    <v-layout
                        align-center
                        justify-center
                        :style="bp.mdAndUp ? 'height: 600px;' : ''"
                        class="black"
                    >
                        <v-btn
                            flat
                            color="#ef001c"
                            fab
                            absolute
                            small
                            style="top: 0; right: 0;"
                            @click.stop="close"
                        >
                            <v-icon>close</v-icon>
                        </v-btn>
                        <video
                            v-if="media.type === 'GraphVideo'"
                            controls
                            :poster="media.display_url"
                            preload="metadata"
                        >
                            <source :src="media.video_url" type="video/mp4" />
                            O seu browser não suporta a reprodução deste vídeo.
                        </video>
                        <v-carousel
                            v-else-if="media.type === 'GraphSidecar'"
                            :cycle="false"
                        >
                            <v-carousel-item
                                v-for="(node, index) in media.sidecar"
                                :key="index"
                            >
                                <in-image
                                    :height="bp.mdAndUp ? 600 : '500'"
                                    contain
                                    :src="node.display_url"
                                    :alt="node.accessibility_caption"
                                ></in-image>
                            </v-carousel-item>
                        </v-carousel>
                        <in-image
                            v-else
                            :height="bp.mdAndUp ? 600 : 'auto'"
                            contain
                            :src="media.display_url"
                            :alt="media.accessibility_caption"
                        ></in-image>
                    </v-layout>
                </v-flex>
                <v-flex xs12 md4>
                    <v-layout row wrap>
                        <v-flex
                            v-if="media.owner"
                            xs12
                            class="mx-2 mt-3"
                            align-center
                        >
                            <a
                                :href="
                                    'https://instagram.com/' +
                                        media.owner.username +
                                        '/'
                                "
                                target="_blank"
                                rel="noopener"
                            >
                                <v-avatar size="40">
                                    <in-image
                                        :src="media.owner.profile_pic_url"
                                        height="40"
                                        width="40"
                                        :alt="media.owner.full_name"
                                    />
                                </v-avatar>
                            </a>
                            <a
                                :href="
                                    'https://instagram.com/' +
                                        media.owner.username
                                "
                                rel="noopener"
                                target="_blank"
                                class="white--text mb-0 ml-3"
                                >{{ media.owner.username }}</a
                            >
                        </v-flex>
                        <v-flex xs12 class="ma-2">
                            <v-divider dark></v-divider>
                        </v-flex>
                        <v-flex xs12>
                            <v-list
                                two-line
                                style="max-height: 450px; overflow-y: auto;"
                            >
                                <p
                                    class="px-2 caption"
                                    v-html="media.caption"
                                ></p>
                                <template
                                    v-for="(node, index) in media.comment"
                                >
                                    <v-list-tile
                                        :key="index"
                                        avatar
                                        :href="
                                            'https://www.instagram.com/' +
                                                node.owner.username +
                                                '/'
                                        "
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        <v-list-tile-avatar>
                                            <img
                                                :src="
                                                    node.owner.profile_pic_url
                                                "
                                            />
                                        </v-list-tile-avatar>
                                        <v-list-tile-content>
                                            <v-list-tile-title
                                                v-html="node.owner.username"
                                            ></v-list-tile-title>
                                            <p
                                                class="mb-0 caption grey--text"
                                                v-html="summary(node.text)"
                                            ></p>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </template>
                            </v-list>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </template>
        <template v-else>
            <v-alert :value="error" type="error">
                <v-layout row wrap>
                    <v-flex xs12>
                        Ocorreu um erro ao buscar os dados dessa publicação no
                        instagram.
                    </v-flex>
                    <v-flex xs12>
                        <v-layout justify-start>
                            <v-btn
                                flat
                                class="py-0 ml-0"
                                small
                                transition="scale-transition"
                                @click.stop="
                                    () => {
                                        error = false
                                        getInstagramMedia()
                                    }
                                "
                                >Tentar Novamente</v-btn
                            >
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-alert>
        </template>
    </v-card>
</template>

<script>
import InLoading from '@/components/app/Loading'
export default {
    components: {
        InLoading
    },
    props: {
        url: {
            type: String,
            required: true,
            default: () => ''
        },
        instagram: {
            type: Object,
            required: true,
            default: () => ''
        }
    },
    data() {
        return {
            loading: true,
            media: {},
            error: false
        }
    },
    computed: {
        bp() {
            return this.$vuetify.breakpoint || {}
        }
    },
    watch: {
        url(val) {
            if (val) this.getInstagramMedia()
        }
    },
    beforeMount() {
        if (this.url && !this.instagram.media) this.getInstagramMedia()
        else this.media = this.instagram.media
    },
    methods: {
        async getInstagramMedia() {
            try {
                const data = await this.$axios.$get(
                    `instagram/media?link=${this.url}`
                )
                this.media = data
                this.loading = false
            } catch (error) {
                this.error = true
                this.media = {}
                this.loading = false
            }
        },
        close() {
            this.media = {}
            this.loading = true
            this.$emit('close-modal')
        },
        summary(text, length, clamp) {
            length = length || 15
            clamp = clamp || '...'
            let isClamp = false
            if (text) {
                return (
                    text
                        .split(' ')
                        .filter((word, index) => {
                            if (index < length) return true
                            isClamp = true
                            return false
                        })
                        .join(' ') + (isClamp ? clamp : '')
                )
            }
            return text
        }
    }
}
</script>

<style scoped>
.v-carousel__controls {
    background: rgba(0, 0, 0, 0) !important;
}
a {
    text-decoration: none;
}
</style>
