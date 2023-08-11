<template>
    <v-menu
        :key="keyItem"
        v-model="menu"
        dark
        fixed
        left
        transition="slide-x-transition"
        :close-on-content-click="false"
        offset-y
        z-index="200"
    >
        <template v-slot:activator="{ on }">
            <v-btn dark v-on="on">
                <v-avatar size="32px">
                    <v-icon>{{ menu ? 'close' : 'account_circle' }}</v-icon>
                </v-avatar>
                <v-icon v-if="!menu" small class="pl-2"
                    >keyboard_arrow_down</v-icon
                >
            </v-btn>
        </template>
        <template>
            <InUserMenu v-if="hasUserLogged" />

            <LoginForm v-else-if="bp.mdAndUp" width="400px" />
            <v-dialog v-else v-model="menu" fullscreen hide-overlay>
                <LoginForm close @close="menu = false" />
            </v-dialog>
        </template>
    </v-menu>
</template>

<script>
import LoginForm from './LoginForm'
import InUserMenu from './UserMenu'
import { mapGetters, mapActions } from 'vuex'
export default {
    components: {
        LoginForm,
        InUserMenu
    },
    data() {
        return {
            menu: false,
            valid: true,
            loading: false,
            error: {
                email: '',
                password: '',
                user: ''
            },
            dataUser: {
                user: '',
                email: '',
                password: '',
                confirmPassword: '',
                name: ''
            },
            showPassword: false,
            rules: {
                required: value => !!value || 'Obrigátorio.',
                min: v => v.length >= 8 || 'Precisa ter no mínimo 8 caracteres',
                email: v => /.+@.+/.test(v) || 'E-mail não é válido'
            },
            keyItem: 1
        }
    },
    computed: {
        ...mapGetters('auth', ['modalLogin', 'hasUserLogged']),
        bp() {
            const { breakpoint } = this.$vuetify
            return breakpoint || {}
        }
    },
    watch: {
        modalLogin(val) {
            this.menu = val
            this.updateKey()
        },
        menu(val) {
            if (this.modalLogin != val) this.setModalLogin(val)
            this.updateKey()
        },
        hasUserLogged() {
            this.updateKey()
        }
    },
    methods: {
        ...mapActions('auth', ['setModalLogin']),
        updateKey() {
            this.keyItem++
            this.$forceUpdate()
        }
    }
}
</script>

<style>
.v-menu__content {
    max-width: 100% !important;
}
</style>
