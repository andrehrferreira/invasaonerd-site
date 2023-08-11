<template>
    <v-container
        class="in-newuser"
        fill-height
        :class="{
            'pt-4': $vuetify.breakpoint.smAndDown,
            'px-2': $vuetify.breakpoint.smAndDown
        }"
    >
        <v-layout
            v-if="loading"
            row
            fill-height
            align-center
            class="animated fadeIn slow loading-overlay"
        >
            <v-layout class="loading-content" column justify-center>
                <v-layout row>
                    <v-flex xs12>
                        <p class="display-1 text-xs-center mb-0">
                            Personalizando para
                            {{ userLogged.profile.fullname }}
                        </p>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <InLoading
                        text="Estamos procurando páginas que achamos que você vai gostar."
                    />
                </v-layout>
            </v-layout>
        </v-layout>
        <v-layout v-else column>
            <v-layout class="header animated faster" row wrap>
                <v-flex xs12>
                    <v-layout row justify-center>
                        <p class="title text-xs-center">
                            <v-icon class="green--text"
                                >check_circle_outline</v-icon
                            >
                            Achamos que talvez você goste destas páginas.
                        </p>
                    </v-layout>
                </v-flex>
                <v-flex xs12>
                    <v-layout row justify-center>
                        <v-flex xs12 sm10 md8 lg6 xl4 class="continue-button">
                            <v-btn
                                block
                                :disabled="selecteds.length < 1"
                                color="success"
                                :loading="loading"
                                @click.stop="sendUserFavorites(selecteds)"
                                >CONCLUIR</v-btn
                            >
                            <v-switch
                                v-model="selecteAll"
                                color="success"
                                :label="
                                    `${
                                        selecteAll ? 'Desmarcar' : 'Marcar'
                                    } todos`
                                "
                            ></v-switch>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-container grid-list-lg fluid>
                    <v-layout wrap>
                        <v-flex
                            v-for="page in pages"
                            :key="page.id"
                            class="in-sugestion-item"
                            xs6
                            sm4
                            md3
                            lg2
                        >
                            <InSugestionItem
                                :page="page"
                                :selected="selecteds.includes(page.id)"
                                @click="pushSelection"
                            />
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-layout>
        </v-layout>
    </v-container>
</template>

<script>
import InSugestionItem from '@/components/newuser/InSugestionItem'
import InLoading from '@/components/app/Loading'
import { mapGetters, mapActions } from 'vuex'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
    middleware: 'auth',
    components: {
        InSugestionItem,
        InLoading
    },
    data: () => ({
        selecteds: [],
        loading: true,
        pages: [],
        selecteAll: false
    }),
    computed: {
        ...mapGetters('auth', ['userLogged'])
    },
    watch: {
        selecteAll(val) {
            if (val) {
                this.selecteds = this.pages.map(p => p.id)
            } else {
                this.selecteds = []
            }
        }
    },
    beforeMount() {
        this.setShowExtendedNavbar(false)
    },
    destroyed() {
        this.setShowExtendedNavbar(true)
    },
    async mounted() {
        this.pages = await this.getpages(this.$axios)
        this.loading = false
    },
    methods: {
        ...mapActions('app', ['setShowExtendedNavbar']),
        ...mapActions('auth', ['setUserPages', 'setUser']),
        async getpages(axios) {
            try {
                const {
                    data: { pages }
                } = await axios.$get('/newuser/selectpages')
                return pages
            } catch (error) {
                console.log(error)
                this.$toast({
                    message: 'Erro de comunicação com o servidor',
                    color: 'warning',
                    icon: 'warning'
                })
                return []
            }
        },

        pushSelection({ id }) {
            if (!this.loading) {
                if (this.selecteds.includes(id)) {
                    this.selecteds = this.selecteds.filter(s => s !== id)
                } else {
                    this.selecteds.push(id)
                }
            }
        },

        async sendUserFavorites(selecteds) {
            this.loading = true
            try {
                const {
                    data: { status }
                } = await this.$axios.post('/newuser/engagementpages', {
                    pages: selecteds,
                    finished: true
                })
                if (status === 200) {
                    this.updateUser()
                    await this.updateUserPages()
                    return this.$router.push('/feed')
                }
            } catch (error) {
                console.log(error)
                this.$toast({
                    message: 'Erro de comunicação com o servidor',
                    color: 'warning',
                    icon: 'warning'
                })
            }
            this.loading = false
        },

        async updateUserPages() {
            let userPages = await this.$axios.$get('/user/pages')
            userPages = userPages.sort(
                (a, b) => b.notifications - a.notifications
            )
            this.setUserPages(userPages)
        },

        updateUser() {
            const user = Object.assign({}, this.userLogged)
            user.newuser = false
            Cookie.set('user', {
                newuser: false
            })
            this.setUser(user)
        }
    }
}
</script>

<style lang="scss" scoped>
.in-newuser {
    .header {
        max-height: 200px;
    }
}
</style>
