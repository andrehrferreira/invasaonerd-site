<template>
    <v-card dark width="280px">
        <v-layout v-if="hasUserLogged" row wrap>
            <v-flex xs12 class>
                <InUserCard :user="userLogged" />
            </v-flex>
            <v-flex xs12>
                <v-layout column wrap class="grey darken-1">
                    <v-list class="grey darken-2 py-0">
                        <v-list-tile class="py-2" @click.stop="logout">
                            <v-list-tile-content>
                                <v-list-tile-title
                                    class="in-user-menu-list-item pl-2"
                                >
                                    <v-icon size="20px" class="mr-2"
                                        >exit_to_app</v-icon
                                    >Logout
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined
import InUserCard from '../user/UserCard'
import { mapGetters, mapActions } from 'vuex'
export default {
    components: {
        InUserCard
    },
    computed: {
        ...mapGetters('auth', ['hasUserLogged', 'userLogged'])
    },
    methods: {
        ...mapActions('auth', [
            'setToken',
            'setUser',
            'setUserPages',
            'setModalLogin'
        ]),
        ...mapActions('app', ['setShowExtendedNavbar', 'setScrollTop']),
        ...mapActions(['setLoadingFullScreen']),
        ...mapActions(['SET_CATEGORIES', 'SET_PAGES']),
        async logout() {
            this.setModalLogin(false)
            await this.$sleep(200)
            this.setLoadingFullScreen(true)
            this.setToken(null)
            this.setUser(null)
            const { categories, pages } = await this.$axios.$get('/home')
            this.SET_CATEGORIES(categories)
            this.SET_PAGES(pages)
            this.setUserPages(null)
            Cookie.remove('auth')
            Cookie.remove('user')
            if (this.routesRequiredLogin(this.$route.name)) {
                this.setShowExtendedNavbar(true)
                this.setScrollTop(0)
                this.$router.push('/')
            } else this.setLoadingFullScreen(false)
        },
        routesRequiredLogin(name) {
            return [
                'feed',
                'createpage',
                'newuser',
                'selectpages',
                'admin-users',
                'admin-users-userId',
                'admin-pages',
                'admin-pages-pageId',
                'admin-bugs',
                'admin-bugs-bugId',
                'admin-feedback',
                'admin-feedback-feedbackId',
                'newuser',
                'newuser-selectpages'
            ].includes(name)
        }
    }
}
</script>

<style scoped>
.in-user-menu-list-item {
    font-size: 1.1rem;
    font-weight: 400;
    margin-bottom: 0;
}
</style>
