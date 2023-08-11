<template>
    <section ref="twitter" class="animated fadeIn" :style="styles">
        <v-layout row wrap>
            <UtilsButtonDelete
                v-show="!removed"
                title="Remover box do Twitter"
                type="twitter"
            />
            <UtilsButtonRedo
                v-show="removed"
                :title="`Desfazer operação de remoção do box do Twitter`"
                :type="type"
            />
        </v-layout>
        <v-layout row wrap>
            <v-flex id="twitter" pa-2 xs12>
                <v-btn block color="#1B95E0" @click.stop="modal = !modal"
                    >Ver Tweets</v-btn
                >
                <v-layout justify-start>
                    <a
                        :href="formatLink(url) + '?ref_src=twsrc%5Etfw'"
                        class="twitter-follow-button"
                        data-show-count="false"
                    ></a>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-dialog
            v-model="modal"
            width="600px"
            max-width="100%"
            transition="dialog-transition"
            persistent
            :fullscreen="isFullScreen"
            @input="modal = !modal"
        >
            <v-card max-width="100%" class="in-specialborder">
                <v-toolbar dark absolute fixed>
                    <v-toolbar-title>
                        Tweets
                        <small>por</small>
                        <a :href="url" target="_blank" rel="noopener"
                            >@{{ title.split(' ').join('') }}</a
                        >
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click.stop="modal = !modal">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-container fluid fill-height class="px-0">
                    <v-layout row wrap fill-height>
                        <v-flex xs12>
                            <a
                                class="twitter-timeline"
                                data-dnt="true"
                                data-theme="dark"
                                data-link-color="#2B7BB9"
                                :href="formatLink(url) + '?ref_src=twsrc%5Etfw'"
                            ></a>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-dialog>
    </section>
</template>

<script>
import UtilsButtonDelete from '../../utils/ButtonDelete'
import UtilsButtonRedo from '../../utils/ButtonRedo'
import typesRemoved from '@/mixins/typesRemoved'
export default {
    components: {
        UtilsButtonDelete,
        UtilsButtonRedo
    },

    mixins: [typesRemoved],
    props: {
        url: {
            type: String,
            required: true,
            default: () => ''
        },
        title: {
            type: String,
            required: true,
            default: () => ''
        }
    },
    data() {
        return {
            modal: false,
            type: 'twitter'
        }
    },
    computed: {
        isFullScreen() {
            return this.$vuetify.breakpoint.width < 500
        }
    },
    beforeMount() {
        var twitterScript = document.createElement('script')
        twitterScript.setAttribute(
            'src',
            'https://platform.twitter.com/widgets.js'
        )
        twitterScript.setAttribute('async', 'true')
        twitterScript.setAttribute('charset', 'utf-8')
        document.head.appendChild(twitterScript)
    },
    methods: {
        formatLink(link) {
            if (link[link.length - 1] === '/') {
                link = link
                    .split('')
                    .filter((letter, index) => {
                        return index + 1 !== link.length
                    })
                    .join('')
            }
            return link
        }
    }
}
</script>

<style scoped>
a {
    color: #1976d2;
    text-decoration: none;
}
.v-container {
    background-color: rgba(0, 0, 0, 0.7);
    overflow-y: auto;
}
</style>
