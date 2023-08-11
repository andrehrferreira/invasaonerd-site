<template>
    <v-container
        align-content-center
        align-center
        justify-center
        class="animated fadeIn"
        fluid
    >
        <v-layout justify-end>
            <v-btn icon dark @click.prevent.stop="back">
                <v-icon>close</v-icon>
            </v-btn>
        </v-layout>
        <v-layout column wrap justify-center align-center>
            <img
                width="180px"
                src="/img/logo/logo-256-white.png"
                alt="Invasão Nerd"
            />
            <p class="white--text title font-weight-regular justify-center">
                A maior comunidade Wiki Nerd do Brasil
            </p>
        </v-layout>
        <v-layout
            column
            align-center="align-center"
            justify-center="justify-center"
        >
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                class="login-form"
            >
                <v-text-field
                    id="name"
                    v-model="dataUser.name"
                    autofocus
                    dark
                    type="text"
                    label="Nome"
                    append-icon="person"
                    required
                    browser-autocomplete
                    tabindex="1"
                    :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                    id="username"
                    v-model="dataUser.user"
                    dark
                    type="text"
                    label="Usuário"
                    append-icon="account_circle"
                    required
                    browser-autocomplete
                    tabindex="2"
                    :rules="[rules.required]"
                    @blur="e => check('user', 'Usuário')"
                ></v-text-field>
                <v-text-field
                    id="email"
                    v-model="dataUser.email"
                    dark
                    type="text"
                    label="Email"
                    append-icon="account_circle"
                    required
                    browser-autocomplete
                    tabindex="3"
                    :rules="[rules.required, rules.email]"
                    @blur="e => check('email', 'Email')"
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
                    tabindex="4"
                    :rules="[rules.required, rules.min]"
                    @click:append="showPassword = !showPassword"
                ></v-text-field>

                <v-text-field
                    v-model="dataUser.confirmPassword"
                    dark
                    :append-icon="
                        showPassword ? 'visibility' : 'visibility_off'
                    "
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete
                    label="Confirmar a senha"
                    required
                    browser-autocomplete
                    :rules="[
                        rules.required,
                        rules.min,
                        passwordConfirmationRule
                    ]"
                    tabindex="5"
                    @blur="e => checkPassword()"
                ></v-text-field>
                <v-checkbox
                    v-model="dataUser.terms"
                    label="Aceitos os termos de privacidade do Invasão Nerd"
                ></v-checkbox>
                <template v-if="message.length" width="100%" pt-2>
                    <v-alert
                        :value="true"
                        type="error"
                        v-html="showMessageError"
                    />
                </template>
            </v-form>
        </v-layout>
        <v-layout></v-layout>
        <v-layout justify-center>
            <v-btn :loading="loading" color="success" medium @click="createUser"
                >Criar conta</v-btn
            >
        </v-layout>
        <v-layout justify-center row wrap pt-5>
            <p class="text-xs-center">
                Já uma conta no Invasão Nerd? &nbsp;
            </p>
            <a href="/signin">Entrar agora</a>
        </v-layout>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    layout: 'blank',
    data() {
        return {
            valid: true,
            loading: false,
            error: {
                email: '',
                password: '',
                user: '',
                terms: ''
            },
            dataUser: {
                user: '',
                email: '',
                password: '',
                confirmPassword: '',
                name: '',
                terms: false
            },
            showPassword: false,
            rules: {
                required: value => !!value || 'Obrigátorio.',
                min: v => v.length >= 8 || 'Precisa ter no mínimo 8 caracteres',
                email: v => /.+@.+/.test(v) || 'E-mail não é válido'
            }
        }
    },
    computed: {
        passwordConfirmationRule() {
            return () =>
                this.dataUser.password === this.dataUser.confirmPassword ||
                'As senhas precisam iguais'
        },
        showMessageError() {
            return `<ul>${this.message
                .map(([, value]) => `<li>${value}</li>`)
                .join('<br/>')}</li>`
        },
        message() {
            return Object.entries(this.error).filter(([, value]) => value)
        }
    },
    methods: {
        ...mapActions(['setLoadingFullScreen']),
        back() {
            this.setLoadingFullScreen(true)
            this.$router.push('/')
        },
        async createUser() {
            this.loading = true

            try {
                if (this.$refs.form.validate() && this.dataUser.terms) {
                    await this.$axios.$post(`/auth/singup`, {
                        dataUser: this.dataUser
                    })
                    this.$toast({
                        message: 'Sua conta foi criada com sucesso!',
                        color: 'success',
                        icon: 'info'
                    })
                    this.$router.push('/signin')
                } else {
                    this.error['terms'] = this.dataUser.terms
                        ? ''
                        : 'Aceite os termos do Invasão Nerd para criar uma conta'

                    this.$toast({
                        message: 'Preencha os campos obrigatórios',
                        color: 'warning',
                        icon: 'warning'
                    })
                }
            } catch ({ response }) {
                const { data } = response || {}
                this.$toast({
                    message: data.error || 'Erro de comunicação com o servidor',
                    color: 'warning',
                    icon: 'warning'
                })
            }
            this.loading = false
        },
        async check(key, type) {
            try {
                await this.$axios.$post('/auth/checkavailable', {
                    key,
                    value: this.dataUser[key],
                    type
                })
                this.error[key] = ''
            } catch ({ response: { data } }) {
                this.error[key] = data.error
            }
        },
        checkPassword() {
            if (this.dataUser.password != this.dataUser.confirmPassword) {
                this.error['password'] = 'As senhas são diferentes'
            } else {
                this.error['password'] = ''
            }
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
</style>
