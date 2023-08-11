<template>
    <v-navigation-drawer
        v-model="drawer"
        fixed
        clipped
        :mini-variant="mini"
        app
        :width="280"
        class="grey darken-4"
        :mini-variant-width="80"
        :mobile-break-point="isTimeline && bp.width ? bp.width + 1 : 1264"
    >
        <v-list dense>
            <v-list-tile v-if="bp.mdAndUp" @click.stop="mini = !mini">
                <v-list-tile-action>
                    <v-tooltip
                        :open-delay="50"
                        :close-delay="50"
                        right
                        :disabled="!mini"
                    >
                        <v-btn slot="activator" icon>
                            <v-icon>{{
                                mini ? 'chevron_right' : 'chevron_left'
                            }}</v-icon>
                        </v-btn>
                        <span>Maximizar</span>
                    </v-tooltip>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title class="grey--text"
                        >MINIMIZAR</v-list-tile-title
                    >
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
        <InSidebarDefault />
        <v-divider v-show="bp.mdAndUp" class="my-2"></v-divider>
        <InSidebarPage :mini="mini" />
        <v-divider class="my-2"></v-divider>
        <InSidebarUser :mini="mini" />
        <v-divider v-show="hasUserLogged" class="my-2"></v-divider>
        <InSidebarAdmin :mini="mini" />
        <v-divider v-show="isAdmin" class="my-2"></v-divider>
        <v-list dense>
            <v-list-tile @click.stop="openBugReport">
                <v-list-tile-action>
                    <v-tooltip
                        :open-delay="50"
                        :close-delay="50"
                        right
                        :disabled="!mini"
                    >
                        <v-btn slot="activator" icon>
                            <v-icon color="#ef001c">bug_report</v-icon>
                        </v-btn>
                        <span>Reportar Bug</span>
                    </v-tooltip>
                </v-list-tile-action>
                <v-list-tile-title>Reportar Bug</v-list-tile-title>
            </v-list-tile>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import InSidebarPage from './sidebar/Page'
import InSidebarUser from './sidebar/User'
import InSidebarAdmin from './sidebar/Admin'
import InSidebarDefault from './sidebar/Default'
export default {
    components: {
        InSidebarPage,
        InSidebarUser,
        InSidebarAdmin,
        InSidebarDefault
    },
    data() {
        return {
            mini: false
        }
    },
    computed: {
        ...mapGetters('app', ['sideBar', 'isTimeline']),
        ...mapGetters('auth', ['hasUserLogged', 'isAdmin']),
        drawer: {
            get() {
                return this.sideBar
            },
            set(val) {
                localStorage.setItem(
                    'sd-drawer',
                    JSON.stringify({
                        state: val
                    })
                )
                this.toggleSideBar(val)
            }
        },
        bp() {
            const { breakpoint } = this.$vuetify
            return breakpoint || {}
        }
    },
    watch: {
        mini(val) {
            localStorage.setItem(
                'sd-mini',
                JSON.stringify({
                    state: val
                })
            )
        }
    },
    beforeMount() {
        if (process.browser) {
            this.setSiderBar()
            this.setMini()
        }
    },
    methods: {
        ...mapActions('app', ['toggleSideBar', 'setModal']),
        ...mapActions('auth', [
            'setModalLogin',
            'setExecutedFunctionAfterLogin'
        ]),
        setSiderBar() {
            const drawer =
                localStorage.hasOwnProperty('sd-drawer') &&
                window.innerWidth > 600
                    ? JSON.parse(localStorage.getItem('sd-drawer')).state
                    : false
            this.toggleSideBar(this.isTimeline ? false : drawer)
        },
        setMini() {
            const mini = localStorage.hasOwnProperty('sd-mini')
                ? JSON.parse(localStorage.getItem('sd-mini')).state
                : false
            this.mini = this.isTimeline ? false : mini
        },
        openBugReport() {
            this.toggleSideBar(false)
            if (this.hasUserLogged) this.setModal('BugReport')
            else {
                const self = this
                this.setExecutedFunctionAfterLogin(function() {
                    self.setModal('BugReport')
                    self.setExecutedFunctionAfterLogin(null)
                })
                this.setModalLogin(true)
            }
        }
    }
}
</script>

<style>
aside.v-navigation-drawer--mini-variant {
    overflow-y: auto !important;
}
</style>
