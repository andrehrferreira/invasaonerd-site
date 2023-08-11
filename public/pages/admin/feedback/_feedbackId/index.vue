<template>
    <InPage
        :page-item="feedback"
        :order-item="order"
        :show-changes="showChange"
    >
        <template v-slot:floating>
            <div v-if="!button.disabled" class="button-feedback">
                <v-fab-transition>
                    <v-tooltip :open-delay="50" :close-delay="50" left>
                        <v-btn
                            slot="activator"
                            dark
                            absolute
                            bottom
                            right
                            fab
                            fixed
                            :color="button.color"
                            @click.stop="open"
                        >
                            <v-icon>{{ button.icon }}</v-icon>
                        </v-btn>
                        <span>{{ button.text }}</span>
                    </v-tooltip>
                </v-fab-transition>
            </div>
        </template>
    </InPage>
</template>

<script>
import InPage from '@/components/page/Page'
import { mapActions, mapGetters } from 'vuex'
import pageEdit from '@/mixins/pageEdit'

export default {
    middleware: ['admin'],
    components: {
        InPage
    },
    mixins: [pageEdit],
    data() {
        return {
            showChange: false
        }
    },
    head() {
        return {
            title: `${this.feedback.title} - Invasão Nerd`
        }
    },
    computed: {
        ...mapGetters(['userLogged']),
        pageItem() {
            return this.$store.getters.getPage
        },
        feedbackId() {
            return this.$route.params.feedbackId
        },
        button() {
            switch (this.feedback.status) {
                case 'pending':
                    return {
                        icon: 'check',
                        color: 'success',
                        text: 'Aprovar edição'
                    }
                case 'aproved':
                    return {
                        icon: 'reply',
                        color: 'secondary',
                        text: 'Recuperar Versão'
                    }
                default:
                    return {
                        disabled: true
                    }
            }
        }
    },
    watch: {
        pageItem(val) {
            this.feedback = val
        }
    },
    async asyncData({ app: { $axios }, params: { feedbackId }, error }) {
        try {
            let actual = {}
            let feedback = await $axios.$get(`/feedback/${feedbackId}`)

            return {
                feedback: feedback.page,
                actual: actual,
                order: feedback.order
            }
        } catch (e) {
            error({ statusCode: 404, message: 'Página não encontrada' })
        }
    },
    beforeMount() {
        const { commit } = this.$store
        commit('SET_PAGE', this.feedback)
        commit('SET_ORDER', this.order)
        this.setReady(false)
        this.$nextTick(() => {
            this.showChange = true
        })
    },

    methods: {
        ...mapActions(['setReady', 'addType']),
        ...mapActions('page', [
            'setPageLoading',
            'setAdding',
            'setEditingType'
        ]),

        open() {
            if (this.feedback.status == 'pending') {
                this.aproveRevision(this.feedbackId)
            }
        },
        async confirmRecovery() {}
    }
}
</script>

<style scoped>
.button-feedback {
    position: relative;
    z-index: 100;
    height: 100px;
}
.v-btn--floating {
    margin-bottom: 50px;
}
</style>
