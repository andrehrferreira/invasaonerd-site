<template>
    <div>
        <v-toolbar
            id="main-toolbal"
            class="grey darken-4"
            dense
            fixed
            clipped-left
            app
            height="60px"
            dark
            :extended="isExtended"
        >
            <v-toolbar-side-icon
                @click.stop="toggleSideBar(!sideBar)"
            ></v-toolbar-side-icon>
            <v-toolbar-title>
                <a href="/">
                    <v-img
                        src="/img/logo/logo-white-site.png"
                        contain
                        width="73px"
                    ></v-img>
                </a>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-layout
                class="hidden-sm-and-down pt-2"
                align-center
                style="max-width: 450px"
            >
                <InSearch :solo="true" />
            </v-layout>
            <v-spacer></v-spacer>
            <v-menu
                offset-x
                left
                dark
                transition="slide-x-transition"
                max-width
                class="hidden-md-and-up"
                :close-on-content-click="false"
                absolute
            >
                <v-btn
                    slot="activator"
                    icon
                    dark
                    @click.stop="searchModal = !searchModal"
                >
                    <v-icon>search</v-icon>
                </v-btn>
                <v-dialog
                    v-model="searchModal"
                    content-class="in-search-modal ma-0"
                    full-width
                    transition="slide-y-transition"
                >
                    <v-card color="dark" class="white--text">
                        <v-layout row align-center>
                            <v-flex xs12 class="pl-3">
                                <InSearch
                                    class="hidden-md-and-up"
                                    @is-open="searchModal = !searchModal"
                                />
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-dialog>
            </v-menu>
            <template v-show="hasUserLogged">
                <v-badge
                    v-if="getNewNotifications.length > 0"
                    overlap
                    color="#ef001c"
                >
                    <small slot="badge">
                        {{
                            getNewNotifications.length > 10
                                ? '9+'
                                : getNewNotifications.length
                        }}
                    </small>
                </v-badge>
                <v-menu
                    v-show="hasUserLogged"
                    v-model="notifications"
                    dark
                    fixed
                    attach
                    left
                    :close-on-content-click="false"
                    nudge-bottom="35"
                    transition="slide-x-transition"
                >
                    <v-btn
                        slot="activator"
                        icon
                        dark
                        class="ma-0"
                        @click.stop="notifications = !notifications"
                    >
                        <v-icon v-show="!notifications">
                            {{
                                getNewNotifications.length > 0
                                    ? 'notifications'
                                    : 'notifications_none'
                            }}
                        </v-icon>
                        <v-icon v-show="notifications">close</v-icon>
                    </v-btn>
                    <InUserNotifications
                        @close-notification="notifications = false"
                    />
                </v-menu>
            </template>

            <InLoginMenu />

            <template v-if="isExtended">
                <template v-if="hasPage">
                    <InPageTab slot="extension" centered />
                </template>
                <template v-else-if="hasPages">
                    <InHomeTab slot="extension" color="grey darken-4" scroll />
                </template>
            </template>
        </v-toolbar>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import InSearch from './Search'
import InPageTab from '../page/Tabs'
import InHomeTab from '../home/Tabs'
import InLoginMenu from './LoginMenu'
import InUserNotifications from './UserNotifications'
export default {
    components: {
        InSearch,
        InPageTab,
        InHomeTab,
        InUserNotifications,
        InLoginMenu
    },
    data() {
        return {
            searchModal: false,
            notifications: false,
            menu: false,
            snackbar: {
                status: false,
                notification: {},
                list: []
            },
            userMenu: true
        }
    },

    computed: {
        ...mapGetters('auth', ['hasUserLogged', 'getNewNotifications']),
        ...mapGetters('app', ['sideBar', 'scrollTop', 'showExtendeNavbar']),
        ...mapGetters(['hasPages', 'hasPage']),

        bp() {
            const { breakpoint } = this.$vuetify
            if (breakpoint.smAndDown) {
                return 100
            } else if (breakpoint.width <= 1500) {
                return breakpoint.width / 3
            } else {
                return 500
            }
        },

        isExtended() {
            const { scrollTop, bp, $vuetify } = this
            return !this.showExtendeNavbar
                ? false
                : this.hasPage || this.hasPages
                ? scrollTop > bp
                : scrollTop > $vuetify.breakpoint.height / 2
        }
    },
    watch: {
        modal() {
            this.toggleUserMenu()
        }
    },
    methods: {
        ...mapActions('auth', ['setModalLogin']),
        ...mapActions('app', ['toggleSideBar']),
        toggleUserMenu() {
            if (this.hasUserLogged) {
                this.menu = this.userMenu
                this.userMenu = !this.userMenu
            } else {
                this.setModalLogin(true)
            }
        }
    }
}
</script>

<style>
.in-search-modal {
    align-self: flex-start !important;
    margin: 0 !important;
}
.v-toolbar .v-badge--overlap .v-badge__badge {
    top: -25px !important;
    left: 15px !important;
}
</style>

<style scoped>
.v-toolbar--clipped {
    z-index: 100;
}

.layout.row {
    margin-right: 0 !important;
    margin-left: 0 !important;
}

.v-toolbar .v-badge {
    display: block !important;
    z-index: 1;
}

.v-tabs__item--active,
.v-tabs__item:not(.v-tabs__item--active):hover {
    background-color: #555555;
}

.v-tabs__item--active:hover {
    background-color: #777777;
}

@media (max-width: 600px) {
    #main-toolbal .v-toolbar__extension {
        padding: 0 !important;
        height: 48px !important;
    }
}
</style>
