<template>
    <v-list v-show="isAdmin" subheader dense>
        <v-subheader class="grey--text text-uppercase">Admin Zone</v-subheader>
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
        ...mapGetters('auth', ['isAdmin', 'hasUserLogged', 'isSuperAdmin']),
        ...mapGetters('page', ['editMode', 'editingType', 'adding']),
        pageItems() {
            return [
                {
                    text: 'Gerenciar Usuários',
                    condition: this.isSuperAdmin,
                    action: this.goTo,
                    payload: '/admin/users',
                    href: '/admin/users',
                    icon: 'people'
                },
                {
                    text: 'Gerenciar Páginas',
                    condition: this.isSuperAdmin,
                    action: this.goTo,
                    payload: '/admin/pages',
                    href: '/admin/pages',
                    icon: 'library_books'
                },
                // {
                //     text: 'Gerenciar Categorias',
                //     condition: this.user.superadmin,
                //     action: this.goTo,
                //     payload: '/manager-categories',
                //     href: '/manager-categories',
                //     icon: 'list_alt'
                // },
                // {
                //     text: 'Convidar',
                //     condition: this.user.admin,
                //     action: val => {
                //         vue.invite = val
                //     },
                //     payload: !vue.invite,
                //     href: false,
                //     icon: 'send'
                // },
                {
                    text: 'Bugs Reportados',
                    condition: this.isAdmin,
                    action: this.goTo,
                    payload: '/admin/bugs',
                    href: '/admin/bugs',
                    icon: 'error_outline'
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
