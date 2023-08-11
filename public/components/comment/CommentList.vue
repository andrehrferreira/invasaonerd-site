<template>
    <v-layout column>
        <v-flex xs12>
            <a
                v-show="commentsCount - count > 0"
                href="javascript:void(0)"
                class="mb-0 caption text-xs-center"
                @click.stop="getComment('all', -1)"
            >
                Ver mais
                {{ commentsCount - count }} comentários
            </a>
        </v-flex>
        <v-flex xs12 class="pt-2" style="max-height: 60vh; overflow: auto;">
            <v-divider class="pb-2"></v-divider>
            <transition-group name="list" tag="div">
                <v-card v-for="cmt in commentsList" :key="cmt._id" flat>
                    <InCommentCard
                        :feed-id="feedId"
                        :comment="cmt"
                        @to-delete="toDelete"
                        @on-reply="onReply"
                        @on-add-reply="onAddReply"
                        @on-add="onAdd"
                        @change-comments-count="changeCommentCount"
                    >
                        <template v-slot:replies>
                            <InCommentReply
                                :feed-id="feedId"
                                :comment-id="cmt._id"
                                :replies-ids="cmt.replies"
                                @change-comments-count="changeCommentCount"
                            />
                        </template>
                    </InCommentCard>
                    <v-divider></v-divider>
                </v-card>
            </transition-group>
        </v-flex>
        <v-flex xs12>
            <InCommentInput :feed-id="feedId" :edit="edit" @on-add="onAdd" />
        </v-flex>
    </v-layout>
</template>

<script>
import InCommentReply from './CommentReply'
import InCommentCard from './CommentCard'
import InCommentInput from './CommentInput'
export default {
    components: {
        InCommentReply,
        InCommentCard,
        InCommentInput
    },
    props: {
        feedId: {
            type: String,
            required: true,
            default: ''
        },
        commentsCount: {
            type: Number,
            required: false,
            default: 5
        }
    },
    data() {
        return {
            comments: [],
            sort: 'timestamp',
            edit: {
                text: ''
            },
            reply: {}
        }
    },
    computed: {
        count() {
            const couunt =
                this.comments.reduce(
                    (total, comment) => total + (comment.replies || []).length,
                    0
                ) + this.comments.length
            return couunt
        },
        commentsList() {
            const { sort, comments } = this
            return comments.sort((a, b) => a[sort] - b[sort])
        }
    },
    beforeMount() {
        this.getComment('news', 5)
    },
    methods: {
        async getComment(order, limit) {
            try {
                const comments = await this.$axios.$get(
                    `feed/comment?feedId=${
                        this.feedId
                    }&order=${order}&limit=${limit}`
                )
                this.comments = comments
            } catch (error) {
                this.comments = []
            }
        },
        changeCommentCount(val) {
            this.$emit('change-comments-count', val)
        },
        onAdd(comment) {
            if (this.comments.every(c => comment._id != c._id))
                this.changeCommentCount(1)
            this.comments = this.comments.filter(c => comment._id != c._id)
            this.comments.push(comment)
            this.edit = {
                text: ''
            }
        },
        async toDelete(comment) {
            try {
                if (confirm('Deseja mesmo deletar este comentário ?')) {
                    const { count } = await this.$axios.$post('/feed/comment', {
                        commentId: comment._id,
                        feedId: this.feedId,
                        quant: -1
                    })
                    this.comments = this.comments.filter(
                        c => comment._id != c._id
                    )
                    this.changeCommentCount(-count)
                }
            } catch (error) {
                this.$toast({
                    message: 'Falha na comunicação com o servidor',
                    color: 'red',
                    icon: 'warning'
                })
            }
        },
        onReply(comment) {
            this.reply = comment
        },
        onAddReply(comment) {
            this.comments = this.comments.map(c => {
                if (comment.commentId === c._id) {
                    c.replies = c.replies.filter(id => comment._id != id)
                    c.replies.push(comment._id)
                }
                return c
            })
        }
    }
}
</script>

<style scoped>
hr.v-divider {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}

.list-enter-active,
.list-leave-active {
    transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active em versões anteriores a 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
}
.list-item {
    display: inline-block;
    margin-right: 10px;
}
.in-small-list > .v-list__tile {
    height: 35px !important;
}
.in-no-border.v-btn.v-btn--outline {
    border: none !important;
}
</style>
