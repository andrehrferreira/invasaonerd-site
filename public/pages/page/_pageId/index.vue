<template>
    <InPage :page-item="page" :order-item="order" :show-changes="showChanges">
        <template v-slot:floating>
            <InFloatingButton />
        </template>
    </InPage>
</template>

<script>
import InPage from '@/components/page/Page'
import InFloatingButton from '@/components/page/FloatingButton'
import { mapActions, mapGetters } from 'vuex'
import scrollPage from '@/mixins/scrollPage'
import head from '@/mixins/head'

export default {
    components: {
        InPage,
        InFloatingButton
    },
    mixins: [scrollPage, head],
    data() {
        return {
            showChanges: false
        }
    },

    computed: {
        ...mapGetters('auth', ['hasUserLogged']),
        pageItem() {
            return this.$store.getters.getPage
        }
    },
    watch: {
        pageItem(val) {
            this.page = val
        }
    },
    async asyncData({ app: { $axios }, params: { pageId }, redirect, store }) {
        try {
            let { page, order } = await $axios.$get(`/page/url/${pageId}`)
            let revision = null
            if (store.state.auth.hasUserLogged) {
                revision = await $axios.$get(`/feedback/user/${page.ref}`)
                if (revision) delete revision._id
            }
            return {
                page,
                revision,
                order,
                metatags: page.metatags
            }
        } catch (e) {
            redirect(`/nomatch/${encodeURI(pageId)}`)
        }
    },
    mounted() {
        const { commit } = this.$store
        commit('SET_PAGE', this.page)
        commit('SET_ORDER', this.order)
        commit('app/SET_TIMELINE', false)
        this.$nextTick(() => {
            this.startApplication()
        })
    },

    methods: {
        ...mapActions(['setPage', 'setReady']),
        ...mapActions('page', ['setEditMode', 'setAdding', 'setEditingType']),
        startApplication() {
            let page = Object.assign({}, this.page)
            if (!page.order) page.order = []
            if (!page.temp) page.temp = {}
            if (!page.changes) page.changes = []
            if (!page.officialPage) page.officialPage = []
            if (!page.configs) {
                page.configs = {
                    images: {
                        avatar: '',
                        cover: ''
                    }
                }
            }
            const ref = new URL(location.href).searchParams.get('ref')
            if (ref && !page.nickname) {
                page.nickname = ref.split('-').join(' ')
            }
            this.saveLocalHostPageOriginal(page)
            this.checkLocalHostPage(page)
        },
        checkLocalHostPage(page) {
            if (this.revision) {
                page = Object.assign(page, this.revision)
                this.setPage(page)
                this.$toast({
                    message: 'Você tem edições que ainda não foram aprovadas',
                    color: 'info',
                    icon: 'info'
                })
            }
            if (localStorage.hasOwnProperty('page-' + page.ref)) {
                if (!this.hasUserLogged) {
                    this.setPage(page)
                } else {
                    this.merge(page)
                    window.onbeforeunload = () => {
                        return ''
                    }
                    this.setEditMode(true)
                    this.$toast({
                        message: 'Você tem edições não finalizadas',
                        color: 'info',
                        icon: 'info'
                    })
                }
            } else if (page.local) {
                this.$router.push('/')
            } else {
                this.setPage(page)
            }
            this.showChanges = true
            this.setReady(false)
        },
        merge(page) {
            if (localStorage.hasOwnProperty('page-' + page.ref)) {
                let local = JSON.parse(localStorage.getItem('page-' + page.ref))
                if (local.feedbackDate == page.feedbackDate) {
                    this.setPage(Object.assign(page, local))
                } else {
                    localStorage.removeItem('page-' + page.ref)
                }
            }
        },
        saveLocalHostPageOriginal(page) {
            localStorage.setItem(
                'original-page-' + page.ref,
                JSON.stringify(page)
            )
        }
    }
}
</script>
