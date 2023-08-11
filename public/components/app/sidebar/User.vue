<template>
    <v-list v-show="hasUserLogged" subheader dense>
        <v-subheader class="grey--text">USUÁRIO</v-subheader>
        <v-list-tile
            v-for="(item, index) in pageItems"
            :key="index"
            :disabled="verifyLocation(item.payload)"
            :class="verifyLocation(item.payload) ? 'grey darken-2' : ''"
            @click.stop="item.action(item.payload)"
        >
            <v-list-tile-action>
                <v-tooltip
                    :open-delay="50"
                    :close-delay="50"
                    right
                    :disabled="!mini"
                >
                    <v-btn
                        slot="activator"
                        icon
                        :disabled="verifyLocation(item.payload)"
                    >
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-btn>
                    <span>{{ item.text }}</span>
                </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
    </v-list>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    props: {
        mini: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    computed: {
        ...mapGetters(['hasPage', 'hasPageFeedback', 'pageURL']),
        ...mapGetters('auth', ['isAdmin', 'hasUserLogged']),
        ...mapGetters('page', ['editMode', 'editingType', 'adding']),
        pageItems() {
            return [
                {
                    text: 'Atualizações',
                    condition: this.hasUserLogged,
                    action: this.goTo,
                    payload: '/feed',
                    href: '/',
                    icon: 'public'
                },
                {
                    text: 'Explorar',
                    condition: this.hasUserLogged,
                    action: this.goTo,
                    payload: '/explore',
                    href: '/explore',
                    icon: 'explore'
                },
                // {
                //     text: 'Minhas Edições',
                //     condition: this.hasUserLogged,
                //     action: this.goTo,
                //     payload: '/editions',
                //     href: '/editions',
                //     icon: 'view_list'
                // },
                {
                    text: 'Gerenciar Revisões',
                    condition: this.isAdmin,
                    action: this.goTo,
                    payload: '/admin/feedback',
                    href: '/admin/feedback',
                    icon: 'rate_review'
                }
            ].filter(({ condition }) => condition)
        }
    },
    methods: {
        ...mapActions(['setLoadingFullScreen']),
        goTo(router) {
            this.setLoadingFullScreen(true)
            this.$router.push(router)
        },
        verifyLocation(path) {
            return this.$route.path == path
        }
    }
}
</script>

<style></style>
