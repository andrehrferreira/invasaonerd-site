<template>
    <v-layout row justify-center class="px-2 py-1" fill-height>
        <v-flex xs1 class="mr-2">
            <v-avatar size="32">
                <img :src="comment.user.avatar" alt="avatar" />
            </v-avatar>
        </v-flex>
        <v-flex xs11>
            <v-layout row wrap>
                <template v-if="!edit">
                    <v-flex xs12>
                        <v-layout row justify-space-between>
                            <v-flex>
                                <a
                                    href="javascript:void(0)"
                                    class="text-truncate"
                                >
                                    <b class="white--text">{{
                                        comment.user.name
                                    }}</b>
                                </a>
                                <span
                                    class="mb-0 grey--text caption text-truncate"
                                >
                                    {{ comment.edited ? 'Editado - ' : ''
                                    }}{{
                                        new Date(
                                            comment.edited
                                                ? comment.editedtimestamp
                                                : comment.timestamp
                                        ).toLocaleString()
                                    }}
                                </span>
                            </v-flex>
                            <v-menu
                                transition="slide-x-transition"
                                offset-x
                                left
                            >
                                <v-btn
                                    slot="activator"
                                    icon
                                    dark
                                    small
                                    class="ma-0"
                                >
                                    <v-icon small>more_horiz</v-icon>
                                </v-btn>

                                <v-list>
                                    <template
                                        v-for="({
                                            condition,
                                            text,
                                            action,
                                            icon
                                        },
                                        index) in commentOptions"
                                    >
                                        <v-list-tile
                                            v-if="condition(comment)"
                                            :key="index"
                                            class="in-small-list"
                                            @click="action"
                                        >
                                            <v-list-tile-title>
                                                <p class="mb-0 caption">
                                                    <v-icon
                                                        small
                                                        class="mr-2"
                                                        >{{ icon }}</v-icon
                                                    >
                                                    {{ text }}
                                                </p>
                                            </v-list-tile-title>
                                        </v-list-tile>
                                    </template>
                                </v-list>
                            </v-menu>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <p
                            class="mb-0 caption"
                            v-html="$urlify(comment.text)"
                        ></p>
                    </v-flex>
                </template>
                <template v-else xs12>
                    <InCommentInput
                        :edit="comment"
                        :avatar="false"
                        :feed-id="feedId"
                        show-cancel
                        @on-cancel="onEdit(false)"
                        @on-add="onAdd"
                    />
                </template>
                <v-flex xs12>
                    <slot name="replies"></slot>
                </v-flex>
                <v-flex v-if="reply" xs12>
                    <InCommentInput
                        :edit="{}"
                        :feed-id="feedId"
                        :comment-id="comment._id"
                        show-cancel
                        @on-cancel="reply = false"
                        @on-add-reply="onAddReply"
                    />
                </v-flex>
            </v-layout>
        </v-flex>
        <InCommentReport :comment="comment" />
    </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import InCommentInput from './CommentInput'
import InCommentReport from './CommmentReport'
export default {
    components: {
        InCommentInput,
        InCommentReport
    },
    props: {
        comment: {
            type: Object,
            required: true,
            default: () => {}
        },
        showButtonReply: {
            type: Boolean,
            require: false,
            default: true
        },
        feedId: {
            type: String,
            required: true,
            default: ''
        }
    },
    data() {
        return {
            reply: false,
            edit: false,
            isReporting: true
        }
    },
    computed: {
        ...mapGetters('auth', ['userLogged']),
        commentOptions() {
            const vue = this
            return [
                {
                    condition: ({ user }) => {
                        return (
                            user.id !== vue.userLogged.id ||
                            this.showButtonReply
                        )
                    },
                    text: 'Responder',
                    icon: 'reply',
                    action: () => this.onReply(true)
                },
                {
                    condition: ({ user }) => {
                        return user.id === vue.userLogged.id
                    },
                    text: 'Editar',
                    icon: 'edit',
                    action: () => this.onEdit(true)
                },
                {
                    condition: ({ user }) => {
                        return (
                            user.id === vue.userLogged.id ||
                            vue.userLogged.superadmin
                        )
                    },
                    text: 'Deletar',
                    icon: 'delete',
                    action: () => this.$emit('to-delete', this.comment)
                },
                {
                    condition: ({ user }) => user.id !== vue.userLogged.id,
                    text: 'Denunciar',
                    icon: 'report',
                    action: vue.reportComment
                }
            ]
        }
    },
    methods: {
        ...mapActions('app', ['setModal']),
        onReply(val) {
            this.reply = val
        },
        onEdit(val) {
            this.edit = val
        },
        onAddReply(val) {
            this.$emit('on-add-reply', val)
        },
        onAdd(val) {
            this.onEdit(false)
            this.$emit('on-add', val)
        },
        reportComment() {
            this.setModal('CommmentReport')
        }
    }
}
</script>

<style scoped>
.v-textarea.v-text-field--box .v-text-field__prefix,
.v-textarea.v-text-field--enclosed .v-text-field__prefix,
.v-textarea.v-text-field--box textarea,
.v-textarea.v-text-field--enclosed textarea {
    margin-top: 8px !important;
}
</style>
