<template>
    <v-container
        fluid
        class="pa-0"
        align-content-start
        align-start
        justify-start
    >
        <v-layout justify-center align-center wrap>
            <v-flex xs12>
                <v-card-title primary-title>
                    <v-flex xs12>
                        <p class="title mb-0 text-xs-center">
                            Não encontramos nada referente a {{ search }}
                        </p>
                    </v-flex>
                </v-card-title>
                <v-divider></v-divider>
                <p class="subtitle text-xs-center" v-if="suggestions[0]">
                    Você quis dizer "{{ suggestions[0].title }}" ?
                </p>
                <v-layout row wrap grid-list-lg fluid>
                    <v-flex
                        v-for="page in suggestions"
                        :key="'panel-' + page.url"
                        xs12
                        sm6
                        md4
                        lg3
                        xl2
                        class="pa-2 animated fadeIn faster"
                    >
                        <InPageItem
                            :page="page"
                            :height="330"
                            :show-follow="false"
                        />
                    </v-flex>
                </v-layout>
                <v-layout row wrap class="mt-3">
                    <v-flex v-show="suggestions.length" xs12>
                        <p class="text-xs-center">Ainda não é o que procura?</p>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row justify-center>
                            <v-btn color="success" @click.stop="createPage"
                                >{{ isAdmin ? 'Criar' : 'Sugerir' }} Página
                                {{ search ? search : '' }}</v-btn
                            >
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import InPageItem from '@/components/home/InPageItem'
import { mapGetters, mapActions } from 'vuex'
import loadingFullScreen from '@/mixins/loadingFullScreen'

export default {
    components: {
        InPageItem
    },
    mixins: [loadingFullScreen],
    computed: {
        ...mapGetters('auth', ['hasUserLogged', 'isAdmin'])
    },
    async asyncData({ params: { search }, app: { $axios }, error, redirect }) {
        try {
            const suggestions = await $axios.$get(`/nomatch/${search}`)
            return {
                suggestions,
                search: search.split('-').join(' ')
            }
        } catch (e) {
            redirect('/')
        }
    },
    methods: {
        ...mapActions('auth', ['setModalLogin', 'setRedirectAfterLogin']),
        createPage() {
            const path = `/createpage?title=${this.search}`
            if (this.hasUserLogged) {
                this.$router.push(path)
            } else {
                this.setRedirectAfterLogin(path)
                this.setModalLogin(true)
            }
        }
    }
}
</script>

<style scoped>
a {
    text-decoration: none !important;
}

span.headline.white--text {
    text-shadow: 1px 1px black;
}
</style>
