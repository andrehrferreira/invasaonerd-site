<template>
    <v-app ref="ready" dark>
        <InSidebar :options="{ page: {} }" />
        <InNavbar />
        <template v-if="hasUserLogged">
            <InBoxNotification />
        </template>
        <v-content>
            <v-container fill-height fluid class="pa-0">
                <nuxt />
            </v-container>
        </v-content>
        <InBugReport />
        <template v-if="loadingFullScreen">
            <InLoadingFullScreen />
        </template>
    </v-app>
</template>

<script>
import InSidebar from '@/components/app/Sidebar'
import InNavbar from '@/components/app/Navbar'
import InBugReport from '@/components/bugs/BugReport'
import InLoadingFullScreen from '@/components/app/LoadingFullScreen'
import InBoxNotification from '@/components/app/BoxNotification'
import { mapGetters } from 'vuex'
export default {
    components: {
        InSidebar,
        InNavbar,
        InBugReport,
        InLoadingFullScreen,
        InBoxNotification
    },
    data() {
        return {
            page: {},
            pages: [],
            categories: []
        }
    },
    computed: {
        ...mapGetters('auth', ['hasUserLogged']),
        ...mapGetters(['loadingFullScreen'])
    }
}
</script>

<style scoped>
.container.fill-height {
    display: block;
}
</style>
