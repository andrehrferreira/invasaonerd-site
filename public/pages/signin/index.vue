<template>
    <v-container
        align-content-center
        align-center
        justify-center
        class="animated fadeIn"
    >
        <v-layout
            column
            align-center="align-center"
            justify-center="justify-center"
        >
            <InLoginForm transparent fullscreen close @close="back" />
        </v-layout>
    </v-container>
</template>

<script>
import InLoginForm from '@/components/app/LoginForm'
import { mapActions } from 'vuex'
export default {
    layout: 'blank',
    components: {
        InLoginForm
    },
    methods: {
        ...mapActions(['setLoadingFullScreen']),
        back() {
            this.setLoadingFullScreen(true)
            this.$router.push('/')
        }
    }
}
</script>

<style lang="scss" scoped>
.login-form {
    max-width: 800px;
    width: 700px;
}
.v-alert {
    width: 100%;
}
.v-card {
    box-shadow: none;
}
</style>
