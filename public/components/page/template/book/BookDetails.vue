<template>
    <v-layout row justify-center>
        <v-dialog
            v-model="modal"
            max-width="700px"
            :fullscreen="$vuetify.breakpoint.smAndDown"
        >
            <v-card class="in-modal-border">
                <div :style="style">
                    <v-toolbar dark color="#212121" absolute>
                        <v-toolbar-title>{{ book.title }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon dark @click.stop="closeModal">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-container fluid>
                        <v-layout column pt-5>
                            <v-flex xs12>
                                <small>
                                    {{ book.authors }}
                                    <br />
                                    {{
                                        new Date(
                                            book.publishedDate
                                        ).toLocaleDateString()
                                    }}
                                    <br />
                                    {{ book.publisher }}
                                </small>
                            </v-flex>
                            <v-flex xs12>
                                <v-card-text
                                    v-html="book.description"
                                ></v-card-text>
                            </v-flex>
                            <v-flex px-3 xs12>
                                <v-btn
                                    dark
                                    @click.stop="
                                        redirectTo(
                                            `https://www.google.com.br/search?biw=2560&bih=938&tbm=shop&ei=64S2W7LHJ8KpwgSm9YKABA&q=${
                                                book.title
                                            }&oq=${book.title}`
                                        )
                                    "
                                >
                                    <v-icon dark>shopping_cart</v-icon>Onde
                                    comprar?
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </div>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        book: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    data() {
        return {
            modal: true
        }
    },
    computed: {
        ...mapGetters({
            icons: 'app/getIcons'
        }),
        style() {
            return {
                backgroundImage: `url(${
                    this.book.thumbnail ? this.toHttps(this.book.thumbnail) : ''
                })`,
                backgroundRepeat: 'no-repeat',
                borderRadius: '4px',
                backgroundSize: 'cover',
                backgroundColor: 'rgba(10,23,55,0.5)'
            }
        }
    },
    watch: {
        modal(val) {
            val || this.closeModal()
        }
    },

    methods: {
        redirectTo(link) {
            window.open(link, '_blank')
        },
        closeModal() {
            this.$emit('close-modal')
        },
        toHttps: link => {
            if (link) return link.replace('http://', 'https://')
            return link
        }
    }
}
</script>

<style scoped>
.container {
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
</style>
