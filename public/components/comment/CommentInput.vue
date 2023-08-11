<template>
    <v-layout row wrap class="mt-2">
        <v-flex id="feed-comment" xs12>
            <v-form>
                <v-textarea
                    ref="textarea"
                    v-model="comment"
                    class="pl-2"
                    autofocus
                    :single-line="text === ''"
                    dark
                    auto-grow
                    rows="1"
                    placeholder="Comentar"
                    type="text"
                    :loading="loading"
                    box
                    validate-on-blur
                    :rules="[
                        v => v.length <= 500 || 'Maximo de 500 caracteres'
                    ]"
                    label
                    :counter="500"
                    @keyup.enter="ctrlEnter"
                >
                    <template v-if="avatar">
                        <v-avatar
                            slot="prepend"
                            class="hidden-xs-only"
                            :size="32"
                        >
                            <img
                                :src="userLogged.profile.avatar"
                                @error="setDefaultImage"
                            />
                        </v-avatar>
                    </template>
                    <v-layout slot="append" column>
                        <v-flex>
                            <v-menu
                                v-model="menu"
                                :close-on-content-click="false"
                                :nudge-width="$vuetify.breakpoint.xs ? 0 : 200"
                                :offset-x="!$vuetify.breakpoint.xs"
                                transition="slide-x-transition"
                                :left="$vuetify.breakpoint.xs"
                            >
                                <v-btn
                                    slot="activator"
                                    class="mr-0 my-0"
                                    icon
                                    dark
                                    :loading="loading === 'emoji'"
                                    title="Inserir Emoji"
                                >
                                    <v-icon>
                                        {{
                                            menu
                                                ? 'close'
                                                : 'sentiment_very_satisfied'
                                        }}
                                    </v-icon>
                                </v-btn>

                                <v-card
                                    v-if="menu"
                                    :width="
                                        $vuetify.breakpoint.xs ? '100%' : ''
                                    "
                                >
                                    <no-ssr>
                                        <keep-alive>
                                            <Picker
                                                set="messenger"
                                                :i18n="i18n"
                                                title="Alterar tom de pele"
                                                emoji="point_right"
                                                @select="pushEmoj"
                                            />
                                        </keep-alive>
                                    </no-ssr>
                                </v-card>
                            </v-menu>
                        </v-flex>
                        <!-- FUTURE FEATURE -->
                        <!-- <v-flex> 
									<v-btn icon class="my-0">
										<v-icon>gif</v-icon>
									</v-btn>
            </v-flex>-->
                    </v-layout>
                </v-textarea>
            </v-form>
        </v-flex>
        <v-flex xs12>
            <v-layout row justify-space-between>
                <v-flex>
                    <v-btn
                        v-show="showCancel"
                        :disabled="loading"
                        flat
                        small
                        class="ma-0"
                        @click.stop="$emit('on-cancel')"
                    >
                        CANCELAR
                        {{ edit._id ? 'EDIÇÃO' : 'COMENTÁRIO' }}
                    </v-btn>
                </v-flex>
                <v-flex>
                    <v-layout justify-end>
                        <v-tooltip :open-delay="50" :close-delay="50" left>
                            <v-btn
                                slot="activator"
                                dark
                                color="success"
                                icon
                                :disabled="
                                    comment.trim() === '' ||
                                        comment.trim().length > 500 ||
                                        (editing ? text === comment : false)
                                "
                                small
                                class="mt-0"
                                :loading="loading"
                                @click.stop="send"
                            >
                                <v-icon small>send</v-icon>
                            </v-btn>
                            <span>
                                {{ editing ? 'Editar' : 'Enviar' }}
                                Comentário
                            </span>
                        </v-tooltip>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { Picker } from 'emoji-mart-vue'

global.EMOJI_DATASOURCE_VERSION = '3.0.0'

import scrollPageTo from '@/mixins/scrollPageTo'
export default {
    components: {
        Picker
    },
    mixins: [scrollPageTo],
    props: {
        feedId: {
            type: String,
            required: true,
            default: ''
        },
        edit: {
            type: Object,
            required: false,
            default: () => {}
        },
        commentId: {
            type: String,
            required: false,
            default: ''
        },
        showCancel: {
            type: Boolean,
            required: false,
            default: false
        },
        avatar: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
        return {
            comment: '',
            menu: false,
            commenting: false,
            loading: false,
            editing: false,
            i18n: {
                search: 'Buscar',
                notfound: 'Nenhum emoj encontrado',
                categories: {
                    search: 'Resultados da busca',
                    recent: 'Recentemente usados',
                    people: 'Pessoas e Carinhas',
                    nature: 'Animais e Natureza',
                    foods: 'Comida e Bebida',
                    activity: 'Atividades',
                    places: 'Viagem e Lugares',
                    objects: 'Objetos',
                    symbols: 'Símbolos',
                    flags: 'Bandeiras',
                    custom: 'Personalizados'
                }
            }
        }
    },
    computed: {
        ...mapGetters('auth', ['userLogged']),
        text() {
            const { edit } = this
            return (edit || {}).text || ''
        },
        links() {
            const { edit } = this
            return (edit || {}).links || []
        }
    },
    watch: {
        edit(val) {
            this.comment = (val.text || '').trim()
            if (this.$refs.textarea.$el)
                this.$refs.textarea.$el.querySelector('textarea').focus()
        },
        text(val) {
            this.comment = val.trim()
            if (this.$refs.textarea.$el)
                this.$refs.textarea.$el.querySelector('textarea').focus()
        }
    },
    beforeMount() {
        if (this.edit && this.edit.text) this.comment = this.edit.text
    },
    methods: {
        pushEmoj({ native }) {
            this.comment += native
        },
        ctrlEnter(e) {
            if (e.key == 'Enter') {
                this.send()
                e.stopPropagation()
            }
        },
        send() {
            if (this.commentId) this.sendReplyComment()
            else this.sendComment()
        },
        toggleComment() {},

        prepareBody(quant, commentId, replyId) {
            const { feedId, userLogged } = this
            return {
                feedId,
                quant,
                commentId,
                replyId,
                comment: {
                    feedId,
                    user: {
                        id: userLogged.id,
                        name: userLogged.profile.fullname
                    },
                    text: this.comment.trim(),
                    likes: this.links
                }
            }
        },
        clear() {
            this.comment = ''
        },
        async sendComment() {
            this.loading = true
            try {
                const quant = this.edit._id ? 0 : 1
                const body = this.prepareBody(quant, this.edit._id)
                const {
                    date,
                    editedtimestamp,
                    _id,
                    edited
                } = await this.$axios.$post('/feed/comment', body)
                let comment = Object.assign(this.edit, body.comment)
                comment._id = _id
                if (edited) comment.edited = edited
                if (date) comment.timestamp = date
                if (editedtimestamp) comment.editedtimestamp = editedtimestamp
                comment.user.avatar = this.userLogged.profile.avatar
                if (this.edit.replies) comment.replies = this.edit.replies
                else comment.replies = []
                this.$emit('on-add', comment)
                this.clear()
                this.$toast({
                    message: `Comentário ${
                        quant === 1 ? 'enviado' : 'editado'
                    } com sucesso!`,
                    color: 'success',
                    icon: 'info'
                })
            } catch (err) {
                this.$toast({
                    message: 'Falha na comunicação com o servidor',
                    color: 'red',
                    icon: 'warning'
                })
            }

            this.loading = false
        },
        async sendReplyComment() {
            this.loading = true
            try {
                const quant = this.edit._id ? 0 : 1
                const body = this.prepareBody(
                    quant,
                    this.commentId,
                    this.edit._id
                )
                const {
                    date,
                    editedtimestamp,
                    _id,
                    edited
                } = await this.$axios.$post('/feed/comment/reply', body)
                let comment = Object.assign(this.edit, body.comment)
                comment._id = _id
                if (edited) comment.edited = edited
                if (date) comment.timestamp = date
                if (editedtimestamp) comment.editedtimestamp = editedtimestamp
                comment.commentId = this.commentId
                comment.user.avatar = this.userLogged.profile.avatar
                this.$emit('on-add-reply', comment)
                this.clear()
                this.$toast({
                    message: `Resposta ${
                        quant === 1 ? 'enviada' : 'editada'
                    } com sucesso!`,
                    color: 'success',
                    icon: 'info'
                })
            } catch (err) {
                this.$toast({
                    message: 'Falha na comunicação com o servidor',
                    color: 'red',
                    icon: 'warning'
                })
            }

            this.loading = false
        },
        setDefaultImage() {}
    }
}
</script>

<style>
div.emoji-mart-category-label > span {
    background-color: #414141 !important;
    border-radius: 20px;
}

.emoji-mart {
    color: white !important;
    background-color: #515151 !important;
}

span.emoji-mart-emoji > span {
    cursor: pointer !important;
}

.emoji-mart-anchor:hover {
    color: white !important;
    cursor: pointer !important;
}

.emoji-mart-anchor.emoji-mart-anchor-selected {
    color: #67ff6d !important;
}

.emoji-mart-anchor-bar {
    background-color: #67ff6d !important;
}
</style>
