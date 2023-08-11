import { mapGetters, mapActions } from 'vuex'
import scrollPageTo from './scrollPageTo'
export default {
    mixins: [scrollPageTo],
    data() {
        return {
            pageChange: {},
            changes: {},
            loading: false
        }
    },
    computed: {
        ...mapGetters({
            page: 'getPage'
        }),
        ...mapGetters('auth', ['userLogged', 'isAdmin']),
        ...mapGetters('page', ['editMode', 'editingType'])
    },
    methods: {
        ...mapActions('page', [
            'toggleModal',
            'setAdding',
            'setEditingType',
            'setAdding',
            'buttonState',
            'adding',
            'setStateBox',
            'setEditMode',
            'setPageLoading'
        ]),
        ...mapActions([
            'setPageChange',
            'setChange',
            'removeType',
            'redoType',
            'saveLocalStorage',
            'editPage',
            'cancelPage',
            'setPage'
        ]),

        editType(type) {
            this.setEditingType(type)
            this.setAdding(true)
            this.setStateBox(false)
            setTimeout(() => {
                this.scrollPageTo(type)
            }, 20)
        },
        saveStore() {
            this.setPageChange(this.pageChange)
            this.setChange(this.changes)
            this.saveLocalStorage()
            this.setAdding(false)
            this.setEditingType('')
            this.pageChange = {}
            this.changes = {}
        },
        cancelEdit() {
            this.setAdding(false)
            this.setEditingType('')
        },
        cancelEditPage() {
            this.setEditMode(false)
            this.setAdding(false)
            this.setEditingType('')
            this.cancelPage()
            this.$toast({
                message: 'Edição cancelada',
                color: 'info',
                icon: 'info'
            })
        },
        removeTypeStore(type) {
            if (confirm('Deseja mesmo remover este box?')) {
                this.removeType(type)
                this.setChange(this.changes)
                this.saveLocalStorage()
            }
        },
        redoTypeStore(type) {
            this.redoType(type)
            this.saveLocalStorage()
        },
        editPageGeneral(data) {
            this.editPage(data)
        },
        async sendEdition(redirect, home = false) {
            try {
                this.loading = true
                this.setPageLoading({
                    active: true,
                    icon: 'pacman',
                    text: 'Enviando para aprovação...'
                })
                window.onbeforeunload = () => {}
                this.setAdding(false)
                this.setEditingType('')
                let page = Object.assign({}, this.page)
                page.user = this.userLogged
                delete page.local
                const feedback = await this.$axios.$post(
                    '/page/send-revision',
                    {
                        page
                    }
                )
                this.setPageLoading({
                    active: false
                })
                this.$toast({
                    message: 'Página enviada para aprovação',
                    color: 'success',
                    icon: 'check-circle'
                })
                if (redirect) {
                    if (this.isAdmin) {
                        await this.aproveRevision(feedback._id, true)
                    } else {
                        this.setEditMode(false)
                        this.setAdding(false)
                        this.setEditingType('')
                    }
                } else {
                    this.loading = false
                }
                localStorage.removeItem('page-' + page.ref)

                if (home) return this.$router.push('/feed')
                return feedback
            } catch (error) {
                this.setPageLoading({
                    active: false
                })
                this.$toast({
                    message: 'Ocorreu um erro no servidor',
                    color: 'red',
                    icon: 'warning'
                })
            }
        },
        async aproveRevision(feedbackId, force = false) {
            try {
                this.setPageLoading({
                    active: true,
                    icon: 'pacman',
                    text: 'Aprovando edição...'
                })
                window.onbeforeunload = () => {}
                const aprovator = {
                    name: this.userLogged.profile.fullname,
                    id: this.userLogged.id
                }
                const page = await this.$axios.$put(`/feedback/${feedbackId}`, {
                    aprovator,
                    pageId: this.page._id
                })
                setTimeout(() => {
                    this.setEditMode(false)
                    this.setAdding(false)
                    this.setEditingType('')
                    this.$toast({
                        message: `Página ${this.page.title} aprovada com sucesso`,
                        color: 'success',
                        icon: 'check-circle'
                    })
                    this.setPageLoading({
                        active: false
                    })
                    if (force) {
                        if (this.page.removed) {
                            this.$router.push('/')
                        } else {
                            this.setPage(page)
                            this.$forceUpdate()
                        }
                    } else {
                        if (this.page.removed) {
                            this.$router.push('/')
                        } else {
                            this.$router.push('/page/' + this.page.url)
                        }
                    }
                }, 100)
            } catch (error) {
                this.setPageLoading({
                    active: false
                })
                this.$toast({
                    message: 'Ocorreu um erro no servidor',
                    color: 'red',
                    icon: 'warning'
                })
            }
        }
    }
}
