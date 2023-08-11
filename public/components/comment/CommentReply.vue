<template>
    <v-layout v-show="countReplies > 0" row wrap>
        <v-flex xs12>
            <a
                href="javascript:void(0)"
                class="mb-0 caption text-xs-center"
                @click.stop="show = !show"
            >
                {{ show ? 'Ocultar' : 'Mostrar' }}
                {{ countReplies }} respostas
            </a>
        </v-flex>

        <v-flex
            v-for="reply in repliesList"
            v-show="show"
            :key="reply._id"
            xs12
        >
            <InCommentCard
                :feed-id="feedId"
                :comment="reply"
                :show-button-reply="false"
                @to-delete="toDelete"
                @on-add="onAdd"
            ></InCommentCard>
        </v-flex>
    </v-layout>
</template>

<script>
import InCommentCard from './CommentCard'
export default {
    components: {
        InCommentCard
    },
    props: {
        repliesIds: {
            type: Array,
            required: false,
            default: () => []
        },
        commentId: {
            type: String,
            required: true,
            default: ''
        },
        feedId: {
            type: String,
            required: true,
            default: ''
        }
    },
    data() {
        return {
            show: false,
            replies: [],
            sort: 'timestamp'
        }
    },
    computed: {
        repliesList() {
            const { sort, replies } = this
            return replies.sort((a, b) => a[sort] - b[sort])
        }
    },
    watch: {
        show(val) {
            val && this.getCommentReplies()
        },
        repliesIds() {
            this.getCommentReplies()
            this.show = true
            this.countReplies = this.repliesIds.length
        }
    },
    beforeMount() {
        this.countReplies = this.repliesIds.length
    },
    methods: {
        async getCommentReplies() {
            try {
                const replies = await this.$axios.$get(
                    `feed/comment/reply?commentId=${this.commentId}`
                )
                this.replies = replies
            } catch (error) {
                this.replies = []
            }
        },
        onAdd(comment) {
            this.replies = this.replies.filter(c => comment._id != c._id)
            this.replies.push(comment)
            this.$emit('change-comments-count', 1)
        },
        async toDelete(comment) {
            try {
                if (confirm('Deseja mesmo deletar este comentário ?')) {
                    const { count } = await this.$axios.$post(
                        '/feed/comment/reply',
                        {
                            replyId: comment._id,
                            commentId: this.commentId,
                            feedId: this.feedId,
                            quant: -1
                        }
                    )
                    this.replies = this.replies.filter(
                        c => comment._id != c._id
                    )
                    this.countReplies--
                    this.$emit('change-comments-count', -count)
                }
            } catch (error) {
                this.$toast({
                    message: 'Falha na comunicação com o servidor',
                    color: 'red',
                    icon: 'warning'
                })
            }
        }
    }
}
</script>

<style></style>
