<template>
    <v-container
        class="in-newuser"
        fill-height
        :class="{
            'pt-4': $vuetify.breakpoint.smAndDown,
            'px-2': $vuetify.breakpoint.smAndDown
        }"
    >
        <v-layout column>
            <v-layout
                class="header animated faster"
                :class="scrolledClass"
                row
                wrap
            >
                <v-flex xs12>
                    <v-layout row justify-center>
                        <p class="title text-xs-center">
                            <v-icon class="green--text"
                                >check_circle_outline</v-icon
                            >
                            Novato, escolha 3 páginas favoritas
                        </p>
                    </v-layout>
                </v-flex>
                <v-flex xs12>
                    <v-layout row justify-center>
                        <p class="subtitle text-xs-center">
                            Vamos usar seus favoritos para achar mais páginas
                            para você! Clique nas páginas que você gosta!
                        </p>
                    </v-layout>
                </v-flex>
                <v-flex xs12>
                    <v-layout row justify-center>
                        <v-flex xs12 sm10 md8 lg6 xl4 class="continue-button">
                            <v-hover>
                                <v-btn
                                    slot-scope="{ hover }"
                                    block
                                    :disabled="selecteds.length < 3"
                                    color="success"
                                    :loading="loading"
                                    :class="{
                                        'animated pulse infinite':
                                            selecteds.length === 3 && !hover
                                    }"
                                    @click.stop="sendUserFavorites(selecteds)"
                                    >CONTINUAR</v-btn
                                >
                            </v-hover>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-container grid-list-lg fluid>
                    <v-layout wrap>
                        <v-flex
                            v-for="(page, index) in pages"
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
                                :hide="
                                    !selecteds.includes(page.id) &&
                                        selecteds.length === 3
                                "
                                :index="index"
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
import scrollPage from '@/mixins/scrollPage'
import InSugestionItem from '@/components/newuser/InSugestionItem'
import { mapGetters, mapActions } from 'vuex'
import loadingFullScreen from '@/mixins/loadingFullScreen'
export default {
    middleware: 'auth',
    components: {
        InSugestionItem
    },
    mixins: [scrollPage, loadingFullScreen],
    data: () => ({
        selecteds: [],
        loading: false
    }),
    computed: {
        ...mapGetters('app', ['scrollTop']),
        ...mapGetters('auth', ['userLogged']),
        scrolledClass() {
            if (this.scrollTop > 150) {
                return ['scrolled', 'fadeInDown']
            }
            return ['fadeIn']
        }
    },
    async asyncData({ app: { $axios } }) {
        try {
            const {
                data: { pages }
            } = await $axios.$get('/newuser/engagementpages')
            return { pages }
        } catch (error) {
            console.log(error)
            return { pages: [] }
        }
    },
    beforeMount() {
        this.setShowExtendedNavbar(false)
    },
    destroyed() {
        this.setShowExtendedNavbar(true)
    },
    methods: {
        ...mapActions('app', ['setShowExtendedNavbar']),
        pushSelection({ id }) {
            if (!this.loading) {
                if (this.selecteds.includes(id)) {
                    this.selecteds = this.selecteds.filter(s => s !== id)
                } else if (this.selecteds.length < 3) {
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
                    pages: selecteds
                })
                if (status === 200) {
                    return this.$router.push('/newuser/selectpages')
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
        }
    }
}
</script>

<style lang="scss" scoped>
.in-newuser {
    .header {
        max-height: 200px;
    }
    .scrolled {
        position: fixed;
        top: 60px;
        left: 0;
        z-index: 1;
        padding: 8px;
        background-color: rgba(0, 0, 0, 0.8);
        width: 100%;
    }
    .continue-button {
        max-width: 500px;
    }
}
</style>
