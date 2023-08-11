<template>
    <v-layout row justify-center>
        <v-dialog
            v-model="modal"
            width="600px"
            :fullscreen="$vuetify.breakpoint.smAndDown"
            persistent
        >
            <v-card dark>
                <v-card-title>
                    <p class="title mb-0">Notícias</p>
                </v-card-title>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout row>
                                <v-text-field
                                    v-model="urlLocal"
                                    :hint="'URL Atual: ' + url"
                                    persistent-hint
                                    label="Informe a URL do Feed de Notícias"
                                ></v-text-field>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-btn dark flat @click.stop="modal = false"
                        >CANCELAR</v-btn
                    >
                    <v-spacer></v-spacer>
                    <v-btn
                        :loading="loading"
                        dark
                        color="success"
                        flat
                        @click.stop="saveLink"
                        >SALVAR</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import pageEdit from '@/mixins/pageEdit'
export default {
    mixins: [pageEdit],
    props: {
        url: {
            type: String,
            required: false,
            default: () => ''
        }
    },
    data() {
        return {
            modal: true,
            urlLocal: this.url,
            loading: false,
            feedsList: {}
        }
    },
    computed: {
        ...mapGetters('page', ['editMode']),
        textLink() {
            return Object.keys(this.links || {}).length ? 'Editar' : 'Adicionar'
        }
    },
    watch: {
        modal(val) {
            val || this.closeModal()
        },
        url() {
            this.urlLocal = Object.assign({}, this.url)
        }
    },
    methods: {
        redirectTo(link) {
            window.open(link, '_blank')
        },
        closeModal() {
            this.cancelEdit()
        },
        async saveLink() {
            if (this.url.toLowerCase() != this.urlLocal.toLowerCase()) {
                this.loading = true
                try {
                    this.feedsList = await this.$axios.$get(
                        `/rss?url=${encodeURIComponent(this.urlLocal)}`
                    )
                    if (this.feedsList && this.feedsList.items) {
                        this.changes = {
                            type: 'feeds',
                            action: 'update'
                        }
                        this.pageChange = {
                            feeds: this.urlLocal,
                            feedsList: this.feedsList
                        }
                        this.saveStore()
                        this.$toast({
                            message: 'URL do Feed salva para envio',
                            color: 'success',
                            icon: 'check-circle'
                        })
                    } else {
                        this.$toast({
                            message: 'URL do Feed informada não é válida',
                            color: 'orange',
                            icon: 'warning'
                        })
                    }
                    this.loading = false
                } catch (error) {
                    this.$toast({
                        message: 'URL do Feed informada não é válida',
                        color: 'orange',
                        icon: 'warning'
                    })
                    this.loading = false
                    this.error = true
                }
            } else {
                this.closeModal()
            }
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
