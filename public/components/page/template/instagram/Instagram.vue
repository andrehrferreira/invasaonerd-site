<template>
    <InPageContainer
        type="instagram"
        title="Instagram"
        show-delete
        show-button-bottom
    >
        <template v-if="infos.id">
            <v-flex xs12 class="py-2">
                <v-layout row justify-start>
                    <v-flex xs4 md3 lg2 xl1>
                        <v-layout justify-center>
                            <a
                                :href="
                                    'https://instagram.com/' + infos.username
                                "
                                target="_blank"
                                rel="noopener"
                            >
                                <v-avatar :size="imageSize">
                                    <in-image
                                        width="100%"
                                        height="auto"
                                        :src="infos.profile_pic_url"
                                        :alt="infos.full_name || ''"
                                        cover
                                    />
                                </v-avatar>
                            </a>
                        </v-layout>
                    </v-flex>
                    <v-flex xs8 md9 lg10 xl11>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <a
                                    :href="
                                        'https://instagram.com/' +
                                            infos.username
                                    "
                                    target="_blank"
                                    class="title grey--text"
                                    rel="noopener"
                                    >@{{ infos.username }}</a
                                >
                            </v-flex>
                            <v-flex xs12>
                                <v-layout justify-start>
                                    <div class="mr-3">
                                        <p class="mb-0 text-xs-center">
                                            <span
                                                class="title font-weight-bold"
                                                >{{ infos.posts }}</span
                                            >
                                            <span class="caption grey--text"
                                                >posts</span
                                            >
                                        </p>
                                    </div>
                                    <div class="mr-3">
                                        <p class="mb-0 text-xs-center">
                                            <span
                                                class="title font-weight-bold"
                                            >
                                                {{
                                                    infos.followed
                                                        | formatNumberToString
                                                }}
                                            </span>
                                            <span class="caption grey--text"
                                                >Seguidores</span
                                            >
                                        </p>
                                    </div>
                                    <div class="mr-3">
                                        <p class="mb-0 text-xs-center">
                                            <span
                                                class="title font-weight-bold"
                                                >{{
                                                    infos.follow
                                                        | formatNumberToString
                                                }}</span
                                            >
                                            <span class="caption grey--text"
                                                >Seguindo</span
                                            >
                                        </p>
                                    </div>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12>
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <p class="mb-0 font-weight-bold">
                                            {{ infos.full_name }}
                                        </p>
                                    </v-flex>
                                    <v-flex xs12>{{ infos.biography }}</v-flex>
                                    <v-flex xs12>
                                        <a
                                            v-if="infos.external_url"
                                            class="grey--text"
                                            :href="infos.external_url"
                                            target="_blank"
                                            rel="noopener"
                                            >{{ infos.external_url }}</a
                                        >
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12>
                <v-divider></v-divider>
            </v-flex>
            <v-flex v-if="infos.is_private" xs12
                >Não foi possível exibir os posts por que este perfil é
                privado.</v-flex
            >
            <v-flex v-else>
                <InPageContent>
                    <v-flex
                        v-for="(node, index) in timeline"
                        :key="index"
                        xs12
                        sm6
                        md4
                        xl2
                        d-flex
                    >
                        <v-hover>
                            <v-card
                                slot-scope="{ hover }"
                                flat
                                tile
                                class="d-flex"
                                :hover="hover"
                                @click.stop="
                                    () => {
                                        dialog = true
                                        midiaLink = node.shortcode
                                        mediaInstagram = node
                                    }
                                "
                            >
                                <in-image
                                    height="320"
                                    :src="
                                        node.thumbnail_resources[bp.lg ? 3 : 2]
                                            .src
                                    "
                                    cover
                                    :alt="node.accessibility_caption || ''"
                                >
                                    <v-container
                                        class="pa-3"
                                        fill-height
                                        :style="
                                            hover
                                                ? 'background-color: rgba(0,0,0,0.6)'
                                                : ''
                                        "
                                    >
                                        <v-layout
                                            fill-height
                                            justify-center
                                            align-center
                                        >
                                            <v-flex v-if="hover">
                                                <p class="body-2 text-xs-right">
                                                    <v-icon small
                                                        >favorite</v-icon
                                                    >
                                                    {{
                                                        node.edge_liked_by
                                                            .count
                                                            | formatNumberToString
                                                    }}
                                                </p>
                                            </v-flex>
                                            <v-spacer>
                                                <v-btn
                                                    v-if="
                                                        node.__typename ===
                                                            'GraphSidecar'
                                                    "
                                                    icon
                                                    fab
                                                    absolute
                                                    small
                                                    style="top: 0; right: 0;"
                                                >
                                                    <v-icon>collections</v-icon>
                                                </v-btn>
                                                <v-btn
                                                    v-if="
                                                        node.__typename ===
                                                            'GraphVideo'
                                                    "
                                                    icon
                                                    fab
                                                    absolute
                                                    small
                                                    style="top: 0; right: 0;"
                                                >
                                                    <v-icon>videocam</v-icon>
                                                </v-btn>
                                            </v-spacer>
                                            <v-flex v-if="hover">
                                                <p class="body-2 text-xs-left">
                                                    <v-icon small
                                                        >mode_comment</v-icon
                                                    >
                                                    {{
                                                        node
                                                            .edge_media_to_comment
                                                            .count
                                                            | formatNumberToString
                                                    }}
                                                </p>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </in-image>
                            </v-card>
                        </v-hover>
                    </v-flex>
                </InPageContent>
                <v-layout justify-center>
                    <v-btn
                        v-if="localLegth == 12"
                        flat
                        small
                        :href="
                            'https://www.instagram.com/' + infos.username + '/'
                        "
                        target="_blank"
                        rel="noopener"
                        >Ver Mais</v-btn
                    >
                    <v-btn v-else small flat @click.stop="localLegth = 12"
                        >Ver Mais</v-btn
                    >
                </v-layout>
            </v-flex>
            <v-dialog v-model="dialog" max-width="935">
                <InstagramMedia
                    :url="midiaLink"
                    :instagram="mediaInstagram"
                    @close-modal="close"
                />
            </v-dialog>
        </template>
        <template v-else>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-alert :value="error" type="error">
                        <v-layout row wrap>
                            <v-flex xs12>
                                Ocorreu um erro ao atualizar os dados do
                                instagram, caso o erro persista, verifique se o
                                este link
                                <a
                                    :href="url"
                                    class="link"
                                    target="_blank"
                                    rel="noopener"
                                    >{{ url }}</a
                                >
                                corresponde ao link do instagram dessa página
                            </v-flex>
                        </v-layout>
                    </v-alert>
                </v-flex>
            </v-layout>
        </template>
    </InPageContainer>
</template>

<script>
import { mapActions } from 'vuex'
import InstagramMedia from './InstagramMedia'
import InPageContent from '@/components/page/utils/PageContent'
import InPageContainer from '@/components/page/utils/PageContainer'

export default {
    filters: {
        formatNumberToString(number) {
            var string = number + ''
            if (string.length > 8)
                return `${string[0] + string[1] + string[2]}mi`
            if (string.length > 7)
                return `${string[0] + string[1]},${string[2]}mi`
            if (string.length > 6) return `${string[0]},${string[1]}mi`
            if (string.length > 5)
                return `${string[0] + string[1] + string[3]}mil`
            if (string.length > 4)
                return `${string[0] + string[1]},${string[2]}mil`
            if (string.length > 3) return `${string[0]},${string[1]}mil`
            return string
        }
    },
    components: {
        InstagramMedia,
        InPageContent,
        InPageContainer
    },
    props: {
        url: {
            type: String,
            required: true,
            default: () => ''
        },
        data: {
            type: Object,
            required: false,
            default: () => {}
        },
        isMain: {
            type: Boolean,
            required: false,
            dafault: true
        }
    },
    data() {
        return {
            infos: this.data,
            dialog: false,
            midiaLink: '',
            mediaInstagram: {},
            error: true,
            localLegth: this.isMain ? 6 : 12
        }
    },
    computed: {
        bp() {
            const { $breakpoint } = this
            return $breakpoint || {}
        },
        imageSize() {
            if (this.bp.xl) return 100
            if (this.bp.mdAndUp) return 120
            if (this.bp.sm) return 100
            return 75
        },
        timeline() {
            const { timeline } = this.infos
            return timeline
                ? timeline.filter((t, i) => i < this.localLegth)
                : []
        }
    },
    watch: {
        data(val) {
            this.infos = val
        }
    },
    methods: {
        ...mapActions(['setTemp']),
        close() {
            this.dialog = false
            this.midiaLink = ''
            this.mediaInstagram = {}
        }
    }
}
</script>

<style lang="scss" scoped>
a {
    text-decoration: none;
}
.link {
    color: blue !important;
}
.v-card {
    border-radius: 5px;
}
</style>
