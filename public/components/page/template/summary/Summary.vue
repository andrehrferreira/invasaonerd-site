<template>
    <InPageContainer
        type="wiki"
        title="Resumo"
        show-button-bottom
        show-delete
        show-edit
    >
        <v-layout px-2 pb-5 class="in-summary" row wrap>
            <v-flex xs12>
                <span v-html="resume"></span>
            </v-flex>
            <v-flex v-if="isShort" xs12 text-xs-center>
                <v-tooltip :open-delay="50" :close-delay="50" bottom>
                    <v-btn
                        slot="activator"
                        icon
                        class="in-see-less-text"
                        @click.stop="isResume = !isResume"
                    >
                        <v-icon>{{ icon }}</v-icon>
                    </v-btn>
                    <span>{{ text }}</span>
                </v-tooltip>
            </v-flex>
        </v-layout>
        <template v-slot:edit>
            <v-container>
                <InEditorWiki :wiki="wiki" />
            </v-container>
        </template>
    </InPageContainer>
</template>

<script>
import InPageContainer from '@/components/page/utils/PageContainer'
import pageEdit from '@/mixins/pageEdit'
import InEditorWiki from './EditorWiki'
export default {
    components: {
        InPageContainer,
        InEditorWiki
    },
    mixins: [pageEdit],
    props: {
        wiki: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    data() {
        return {
            isResume: true,
            isShort: true
        }
    },
    computed: {
        summary() {
            return this.wiki.summary || ''
        },
        resume() {
            const {
                breakpoint: { width }
            } = this.$vuetify
            return this.isResume && this.isShort
                ? this.summary
                      .split('')
                      .filter((letter, index) => {
                          if (width > 1200) return index <= 600
                          if (width > 992) return index <= 500
                          if (width > 768) return index <= 400
                          if (width > 576) return index <= 300
                          return index <= 200
                      })
                      .join('') + '...'
                : this.summary
        },
        icon() {
            return this.isResume ? 'expand_more' : 'expand_less'
        },
        text() {
            return this.isResume ? 'Ver mais' : 'Ver menos'
        }
    },
    beforeMount() {
        this.$nextTick(() => {
            const { breakpoint } = this.$vuetify
            const length = this.summary.split(' ').length
            if (
                breakpoint &&
                ((breakpoint.width < 500 && length > 100) ||
                    (breakpoint.width >= 500 && length > 200))
            ) {
                this.isShort = true
            } else {
                this.isShort = false
            }
        })
    },
    methods: {}
}
</script>

<style scoped>
.in-summary {
    padding: 0px;
    text-align: justify;
    text-shadow: none;
    padding-top: 0px;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: normal;
    overflow: hidden;
    font-size: 15px;
    color: #efefef;
    word-wrap: break-word;
}

.in-page-fullinfo {
    margin: none;
    list-style: none;
    padding: 0px;
}
</style>
