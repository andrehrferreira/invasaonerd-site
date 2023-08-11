<template>
    <v-layout row pa-2>
        <v-flex v-if="editingType === 'featuredPages'">
            <EditorFeaturedPages :featured-pages="featuredPagesLocal" />
        </v-flex>
        <v-flex v-else xs12>
            <v-layout row justify-space-between>
                <v-flex xs11 pt-2>
                    <p class="mb-0 title">Páginas Relacionadas</p>
                </v-flex>
                <ButtonEdit
                    bottom
                    type="featuredPages"
                    classes="ma-0"
                    title="Editar Páginas Relacionadas"
                />
            </v-layout>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-layout row wrap justify-space-around>
                        <v-flex
                            v-for="(featuredPage, index) in featuredPagesLocal"
                            :key="index"
                            md6
                            lg4
                            xl3
                            class="px-2 animated zoomIn fast"
                        >
                            <a
                                :href="`/page/${featuredPage.url}`"
                                target="_blank"
                                style="width:120px; word-wrap:break-word;"
                            >
                                <v-layout column align-center>
                                    <v-avatar size="80px">
                                        <in-image
                                            text-xs-center
                                            :src="featuredPage.avatar"
                                            :alt="featuredPage.title"
                                            cover
                                            @error="setDefaultImage"
                                        />
                                    </v-avatar>
                                    <span
                                        class="text-xs-center in-editor-featured-pages-title"
                                    >
                                        {{ featuredPage.title }}
                                    </span>
                                </v-layout>
                            </a>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
import pageEdit from '@/mixins/pageEdit'
import EditorFeaturedPages from './EditorFeaturedPages'
import ButtonEdit from '../../utils/ButtonEdit'
export default {
    components: {
        EditorFeaturedPages,
        ButtonEdit
    },
    mixins: [pageEdit],
    props: {
        featuredPages: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    data() {
        return {
            featuredPagesLocal: this.featuredPages
        }
    },
    watch: {
        async featuredPages() {
            this.featuredPagesLocal = this.featuredPages
            this.getPageFeatured()
        }
    },
    async beforeMount() {
        this.getPageFeatured()
    },
    methods: {
        async getPageFeatured() {
            try {
                this.featuredPagesLocal = await this.$axios.$post(
                    '/page/featured-pages',
                    {
                        featuredPages: (this.featuredPagesLocal || []).filter(
                            p => p.url
                        )
                    }
                )
            } catch (error) {
                console.log(error)
            }
        },
        getOnlyTitle(string) {
            if (string.includes('(') && string.includes(')')) {
                return string.split(' (')[0]
            }
            return string
        },

        setDefaultImage(event) {
            event.target.src = '/img/avatardefault.jpeg'
        }
    }
}
</script>

<style scoped>
.in-image {
    width: 100% !important;
    height: auto;
    display: block;
    border: 0;
    position: relative;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 100%;
    max-width: 80px;
    max-height: 80px;
}
.in-editor-featured-pages-title {
    padding: 5px 0 10px 0;
    text-shadow: none;
    line-height: 18px;
    color: white;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: normal;
    overflow: hidden;
}
a {
    text-decoration: none;
}
</style>
