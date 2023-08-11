<template>
    <v-app ref="ready" dark>
        <v-content>
            <v-container fluid class="pa-2">
                <nuxt />
            </v-container>
        </v-content>
        <template v-if="loadingFullScreen">
            <InLoadingFullScreen />
        </template>
    </v-app>
</template>

<script>
import InLoadingFullScreen from '@/components/app/LoadingFullScreen'
import { mapGetters } from 'vuex'
export default {
    components: {
        InLoadingFullScreen
    },
    computed: {
        ...mapGetters(['loadingFullScreen'])
    }
}
</script>

<style scoped>
.theme--dark.application {
    background-color: #212121 !important;
}
</style>
