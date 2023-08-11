<template>
    <v-layout row justify-center>
        <v-dialog
            v-model="modal"
            max-width="900px"
            :fullscreen="$vuetify.breakpoint.smAndDown"
            persistent
        >
            <v-card class="in-modal-border" :style="minHeight">
                <div :style="style">
                    <v-toolbar color="#212121">
                        <v-toolbar-title>{{ title }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon dark @click.stop="closeModal">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-container
                        fluid
                        :style="minHeight"
                        class="container-main"
                    >
                        <template v-if="loading">
                            <InLoading />
                        </template>
                        <template v-else>
                            <v-layout v-if="editMode && showAddLinks" row>
                                <v-flex xs12>
                                    <v-layout justify-end>
                                        <v-btn
                                            color="primary"
                                            @click.stop="addLinks = true"
                                        >
                                            <v-icon dark>add</v-icon
                                            >{{ textLink }} links
                                        </v-btn>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex>
                                    <v-btn
                                        v-show="linksLocal.netflix"
                                        small
                                        dark
                                        @click.stop="
                                            redirectTo(linksLocal.netflix)
                                        "
                                    >
                                        <div
                                            class="in-basic-infos-form-icons"
                                            v-html="icons.netflix"
                                        ></div>
                                        Assistir no Netflix
                                    </v-btn>
                                    <v-btn
                                        v-show="linksLocal.youtube"
                                        small
                                        dark
                                        @click.stop="
                                            redirectTo(linksLocal.youtube)
                                        "
                                    >
                                        <div
                                            class="in-basic-infos-form-icons"
                                            v-html="icons.youtube"
                                        ></div>
                                        Assistir no Youtube
                                    </v-btn>
                                    <v-btn
                                        v-show="linksLocal.hbo"
                                        small
                                        dark
                                        @click.stop="redirectTo(linksLocal.hbo)"
                                    >
                                        <div
                                            class="in-basic-infos-form-icons"
                                            v-html="icons.hbo"
                                        ></div>
                                        Assistir no HBO Go
                                    </v-btn>

                                    <v-btn
                                        v-show="linksLocal.href"
                                        small
                                        dark
                                        @click.stop="redirectTo(href)"
                                    >
                                        <v-icon dark>shopping_cart</v-icon>Onde
                                        comprar?
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                            <v-layout v-show="overview" column>
                                <InPageTitle font-size="22px"
                                    >Resumo:</InPageTitle
                                >
                                <p class="in-series-img-text-p pa-2">
                                    {{ overview }}
                                </p>
                            </v-layout>
                            <slot></slot>
                        </template>
                    </v-container>
                </div>
            </v-card>
        </v-dialog>
        <template v-if="addLinks">
            <v-dialog
                v-model="addLinks"
                width="600px"
                :fullscreen="$vuetify.breakpoint.smAndDown"
                persistent
            >
                <v-card dark>
                    <v-card-title>
                        <p class="title mb-0">{{ textLink }} Links</p>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-layout row>
                                    <v-avatar size="32" class="mt-3 mr-2">
                                        <span
                                            style="height: 100%; width: 100%;"
                                            v-html="icons.netflix"
                                        ></span>
                                    </v-avatar>
                                    <v-text-field
                                        v-model="linksLocal.netflix"
                                        label="Netflix"
                                    ></v-text-field>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12>
                                <v-layout row>
                                    <v-avatar size="32" class="mt-3 mr-2">
                                        <span
                                            style="height: 100%; width: 100%;"
                                            v-html="icons.hbo"
                                        ></span>
                                    </v-avatar>
                                    <v-text-field
                                        v-model="linksLocal.hbo"
                                        label="HBO GO"
                                    ></v-text-field>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12>
                                <v-layout row>
                                    <v-avatar size="32" class="mt-3 mr-2">
                                        <span
                                            style="height: 100%; width: 100%;"
                                            v-html="icons.youtube"
                                        ></span>
                                    </v-avatar>
                                    <v-text-field
                                        v-model="linksLocal.youtube"
                                        label="Youtube Premium"
                                    ></v-text-field>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn dark flat @click.stop="addLinks = false"
                            >CANCELAR</v-btn
                        >
                        <v-spacer></v-spacer>
                        <v-btn dark color="success" flat @click.stop="saveLink"
                            >SALVAR</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </template>
    </v-layout>
</template>

<script>
import InLoading from '@/components/app/Loading'
import InPageTitle from '@/components/page/utils/PageTitle'
import { mapGetters } from 'vuex'
export default {
    components: {
        InLoading,
        InPageTitle
    },
    props: {
        title: {
            type: String,
            required: true,
            default: ''
        },
        image: {
            type: String,
            required: true,
            default: ''
        },
        overview: {
            type: String,
            required: false,
            default: ''
        },
        href: {
            type: String,
            required: false,
            default: ''
        },
        loading: {
            type: Boolean,
            required: true,
            default: false
        },
        links: {
            type: Object,
            required: false,
            default: () => {}
        },
        showAddLinks: {
            type: Boolean,
            required: false,
            default: true
        }
    },

    data() {
        return {
            modal: true,
            seasonDetail: {},
            error: false,
            showSerieIndex: 0,
            addLinks: false,
            linksLocal: Object.assign({}, this.links)
        }
    },
    computed: {
        ...mapGetters('page', ['editMode']),
        ...mapGetters({
            icons: 'app/getIcons'
        }),
        style() {
            return {
                backgroundImage: `url(${this.image})`,
                backgroundRepeat: 'no-repeat',
                borderRadius: '4px',
                backgroundSize: 'cover',
                backgroundColor: 'rgba(10,23,55,0.5)',
                backgroundAttachment: 'fixed'
            }
        },
        minHeight() {
            return {
                'min-height': '600px'
            }
        },
        textLink() {
            return Object.keys(this.links || {}).length ? 'Editar' : 'Adicionar'
        }
    },
    watch: {
        modal(val) {
            val || this.closeModal()
        },
        links() {
            this.linksLocal = Object.assign({}, this.links)
        }
    },
    methods: {
        redirectTo(link) {
            window.open(link, '_blank')
        },
        closeModal() {
            this.$emit('close-modal')
        },
        saveLink() {
            this.addLinks = false
            this.$emit('links', this.linksLocal)
        }
    }
}
</script>

<style scoped>
.container-main {
    background-color: rgba(0, 0, 0, 0.8);
}
.in-modal-border {
    border: 1px solid #000;
    -webkit-box-shadow: inset 0px 0px 1px 1px rgba(255, 255, 255, 0.8);
    -moz-box-shadow: inset 0px 0px 1px 1px rgba(255, 255, 255, 0.8);
    box-shadow: inset 0px 0px 1px 1px rgba(255, 255, 255, 0.8);
    /*border:1px solid #404040;
    outline: 1px solid #000;*/
}
.in-movie-preview-fade {
    background: rgba(0, 0, 0, 1);
    background: -moz-linear-gradient(
        45deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(1, 1, 1, 1) 5%,
        rgba(18, 18, 18, 0.15) 100%
    );
    background: -webkit-gradient(
        left bottom,
        right top,
        color-stop(0%, rgba(0, 0, 0, 1)),
        color-stop(5%, rgba(1, 1, 1, 1)),
        color-stop(100%, rgba(18, 18, 18, 0.15))
    );
    background: -webkit-linear-gradient(
        45deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(1, 1, 1, 1) 5%,
        rgba(18, 18, 18, 0.15) 100%
    );
    background: -o-linear-gradient(
        45deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(1, 1, 1, 1) 5%,
        rgba(18, 18, 18, 0.15) 100%
    );
    background: -ms-linear-gradient(
        45deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(1, 1, 1, 1) 5%,
        rgba(18, 18, 18, 0.15) 100%
    );
    background: linear-gradient(
        45deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(1, 1, 1, 1) 5%,
        rgba(18, 18, 18, 0.15) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#000000', endColorstr='#121212', GradientType=1);
    height: 100%;
}
</style>

<style>
.in-basic-infos-form-icons svg {
    width: 24px;
    height: 24px;
    margin-right: 8px;
}
</style>
