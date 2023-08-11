<template>
    <v-card
        :class="{
            grey: !transparent,
            'darken-4': !transparent
        }"
        :color="transparent ? 'transparent' : ''"
        :width="width"
    >
        <v-layout v-show="close" justify-end>
            <v-btn icon dark @click.prevent.stop="$emit('close')">
                <v-icon>close</v-icon>
            </v-btn>
        </v-layout>
        <v-container pl-5 pr-5 :class="{ 'login-form': fullscreen }">
            <v-layout v-show="close" column wrap justify-center align-center>
                <img
                    width="180px"
                    src="/img/logo/logo-256-white.png"
                    alt="Invasão Nerd"
                    pt-2
                />
                <p
                    class="white--text subtitle font-weight-regular justify-center mt-4"
                >
                    A maior comunidade Wiki Nerd do Brasil
                </p>
                <v-divider></v-divider>
            </v-layout>
            <template v-if="isLocal">
                <v-card-text>
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-text-field
                            id="email"
                            ref="email"
                            v-model="dataUser.username"
                            dark
                            type="text"
                            label="Usuário"
                            append-icon="person"
                            required
                            browser-autocomplete
                            tabindex="1"
                            :rules="[rules.required]"
                        ></v-text-field>

                        <v-text-field
                            v-model="dataUser.password"
                            dark
                            autocomplete
                            label="Senha"
                            :append-icon="
                                showPassword ? 'visibility' : 'visibility_off'
                            "
                            :type="showPassword ? 'text' : 'password'"
                            required
                            browser-autocomplete
                            tabindex="2"
                            :rules="[rules.required, rules.min]"
                            @click:append="showPassword = !showPassword"
                            @keyup.enter="local"
                        ></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-layout column>
                        <v-btn
                            block
                            large
                            color="secondary"
                            tabindex="3"
                            @click.prevent.stop="local"
                            >ENTRAR</v-btn
                        >
                    </v-layout>
                </v-card-actions>
            </template>
            <template v-else>
                <v-card-text>
                    <p class="text-xs-center">
                        Entre usando suas redes sociais
                    </p>
                </v-card-text>
                <v-layout column>
                    <div
                        id="customBtn"
                        tabindex="1"
                        class="customGPlusSignIn v-btn--block"
                        @click.prevent.stop="signInGoogle"
                    >
                        <span class="icon"></span>
                        <span class="parent">
                            <span class="buttonText">Entrar com Google</span>
                        </span>
                    </div>
                    <v-divider></v-divider>
                    <v-btn
                        large
                        block
                        color="secondary"
                        tabindex="2"
                        @click.prevent.stop="isLocal = true"
                        >ENTRAR USANDO LOGIN</v-btn
                    >
                </v-layout>
            </template>

            <v-card-text>
                <v-layout justify-center row wrap>
                    <p class="text-xs-center">
                        Ainda não possui uma conta no Invasão Nerd? Você pode
                        criar, editar e ter o melhor conteúdo nerd da Internet!
                    </p>
                    <a href="/signup">Cadastre-se agora</a>
                </v-layout>
            </v-card-text>
        </v-container>
    </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { setTimeout } from 'timers'
const Cookie = process.client ? require('js-cookie') : undefined
export default {
    props: {
        width: {
            type: String,
            default: '100%'
        },
        close: {
            type: Boolean,
            default: false
        },
        fullscreen: {
            type: Boolean,
            default: false
        },
        transparent: {
            type: Boolean,
            default: false
        }
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
                username: '',
                password: ''
            },
            showPassword: false,
            rules: {
                required: value => !!value || 'Obrigátorio.',
                min: v => v.length >= 8 || 'Precisa ter no mínimo 8 caracteres',
                email: v => /.+@.+/.test(v) || 'E-mail não é válido'
            },
            isLocal: false
        }
    },
    computed: {
        bp() {
            const { breakpoint } = this.$vuetify
            return breakpoint || {}
        },
        ...mapGetters('auth', [
            'hasUserLogged',
            'userLogged',
            'redirectAfterLogin',
            'executedFunctionAfterLogin'
        ]),
        ...mapGetters({
            icons: 'app/getIcons'
        })
    },
    watch: {
        isLocal(val) {
            if (val) {
                const self = this
                setTimeout(() => {
                    self.$refs.email.focus()
                    self.$refs.email.isFocused = true
                }, 200)
            }
        }
    },
    methods: {
        ...mapActions(['setLoadingFullScreen']),
        ...mapActions('auth', [
            'setModalLogin',
            'setToken',
            'setUser',
            'setUserPages',
            'setRedirectAfterLogin'
        ]),
        ...mapActions('app', ['setShowExtendedNavbar']),
        validate() {
            if (this.$refs.form.validate()) {
                this.snackbar = true
            }
        },
        async local(event) {
            if (event) {
                event.preventDefault()
                event.stopPropagation()
            }
            try {
                const {
                    data: { token, user }
                } = await this.$axios.$post('/auth/signin/local', {
                    username: this.dataUser.username,
                    password: this.dataUser.password
                })
                this.callbackLogin(token, user)
            } catch ({ response }) {
                const { data } = response || {}
                this.$toast({
                    message: data || 'Erro de comunicação com o servidor',
                    color: 'warning',
                    icon: 'warning'
                })
            }
        },
        async google(profile) {
            try {
                const {
                    data: { token, user }
                } = await this.$axios.$post('/auth/signin/google', {
                    profile
                })
                this.callbackLogin(token, user)
            } catch (data) {
                const { error } = data.response || {}
                this.$toast({
                    message: error || 'Erro de comunicação com o servidor',
                    color: 'warning',
                    icon: 'warning'
                })
            }
        },
        async callbackLogin(token, user) {
            this.setModalLogin(false)

            await this.$sleep(500)

            const auth = {
                token
            }
            this.setToken(token)
            this.setUser(user)
            Cookie.set('auth', auth)
            this.$toast({
                message: 'Olá ' + user.profile.fullname,
                color: 'green',
                icon: 'info'
            })
            let userPages = await this.$axios.$get('/user/pages')
            this.setUserPages(userPages)
            if (typeof this.executedFunctionAfterLogin == 'function') {
                await this.executedFunctionAfterLogin()
            }
            if (
                this.redirectAfterLogin != null &&
                this.redirectAfterLogin != '/feed'
            )
                this.$router.push(this.redirectAfterLogin)
            else if (
                (this.$route.path == '/' || this.$route.path == '/signin') &&
                this.redirectAfterLogin != null
            ) {
                this.setLoadingFullScreen(true)
                this.$router.push('/feed')
            }
            this.setRedirectAfterLogin('/feed')
        },
        signInGoogle() {
            this.$gAuth
                .signIn()
                .then(GoogleUser => {
                    this.google(GoogleUser.getBasicProfile())
                })
                .catch(({ error }) => {
                    let msg =
                        'Não foi possível estabelecer comunicação com servidor da Google'

                    if (error == 'popup_closed_by_user')
                        msg = 'A popup do Google foi fechada por você'
                    this.$toast({
                        message: msg,
                        color: 'warning',
                        icon: 'warning'
                    })
                })
        }
    }
}
</script>

<style scoped>
.login-form {
    max-width: 800px;
    width: 700px;
}
#customBtn {
    display: flex;
    background: white;
    color: #444;
    border-radius: 5px;
    border: thin solid #888;
    box-shadow: 1px 1px 1px grey;
    white-space: nowrap;
}
#customBtn:hover {
    cursor: pointer;
}
span.label {
    font-family: serif;
    font-weight: normal;
}
span.icon {
    background: url('/img/google.png') transparent 5px 50% no-repeat;
    display: inline-block;
    vertical-align: middle;
    width: 42px;
    height: 42px;
}
span.parent {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
}
span.buttonText {
    display: inline-block;
    vertical-align: middle;
    padding-right: 42px;
    font-size: 14px;
    font-weight: bold;
    font-family: 'Roboto', sans-serif;
}
.v-btn {
    min-height: 44px;
}
</style>
