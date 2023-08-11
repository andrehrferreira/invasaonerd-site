<template>
    <v-layout row v-bind="styleSignUp">
        <v-flex v-if="large" xs12>
            <v-layout row justify-center>
                <v-flex xs10 px-0>
                    <v-btn
                        :large="large"
                        type="button"
                        class="p-0 m-0 buttonFollow"
                        :color="color"
                        :loading="loading"
                        :disabled="loading"
                        @click.prevent.stop="followUnfollow(false)"
                        >{{ text }}</v-btn
                    >
                </v-flex>
            </v-layout>
        </v-flex>
        <v-btn
            v-else
            type="button"
            :color="color"
            :loading="loading"
            :disabled="loading"
            @click.prevent.stop="followUnfollow(false)"
            >{{ text }}</v-btn
        >
        <v-dialog
            v-model="unsubscribe"
            transition="dialog-transition"
            max-width="500px"
        >
            <v-card>
                <v-card-text
                    >Deseja cancelar a inscrição na página
                    {{ title }}?</v-card-text
                >
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" flat @click.native="unsubscribe = false"
                        >CANCELAR</v-btn
                    >
                    <v-btn
                        color="#ef001c"
                        flat
                        @click.stop.prevent="followUnfollow(true)"
                        >CANCELAR INSCRIÇÃO</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    props: {
        pageId: {
            type: String,
            required: true,
            default: ''
        },
        title: {
            type: String,
            required: true,
            default: ''
        },
        url: {
            type: String,
            required: true,
            default: ''
        },
        large: {
            type: Boolean,
            required: false,
            default: false
        },
        justify: {
            type: String,
            default: 'center'
        }
    },
    data() {
        return {
            loading: false,
            unsubscribe: false
        }
    },
    computed: {
        ...mapGetters('auth', ['userLogged', 'userPagesList']),
        color() {
            return this.isFollow ? '#4b4b4b' : '#ef001c'
        },
        text() {
            return this.isFollow ? 'INSCRITO' : 'INSCREVER-SE'
        },
        styleSignUp() {
            return {
                [`justify-${this.justify}`]: true
            }
        },
        isFollow() {
            return this.userPagesList.some(
                ({ id }) => id.toString() == this.pageId
            )
        }
    },
    methods: {
        ...mapActions('auth', [
            'setModalLogin',
            'setUserPages',
            'setRedirectAfterLogin',
            'setExecutedFunctionAfterLogin'
        ]),
        async followUnfollow(force = false, isLogin = false) {
            if (!this.userLogged.id) {
                const self = this
                this.setExecutedFunctionAfterLogin(async function() {
                    self.setRedirectAfterLogin(null)
                    await self.followUnfollow(false, true)
                    self.setExecutedFunctionAfterLogin(null)
                })
                return this.setModalLogin(true)
            }

            if (this.isFollow && !force && !isLogin) {
                this.unsubscribe = true
                return
            }
            if (this.isFollow && isLogin) return

            this.unsubscribe = false
            this.loading = true
            try {
                await this.$axios.$post('/user/follow', {
                    pageId: this.pageId
                })
                let userPages = await this.$axios.$get('/user/pages')
                userPages = userPages.sort(
                    (a, b) => b.notifications - a.notifications
                )
                this.setUserPages(userPages)
                this.$emit('follow', {
                    following: this.isFollow,
                    pageId: parseInt(this.pageId)
                })
            } catch (error) {
                this.$toast({
                    message: 'Falha na comunicação com o servidor',
                    color: 'red',
                    icon: 'warning'
                })
            }
            this.loading = false
        }
    }
}
</script>

<style scoped>
.buttonFollow {
    width: 100%;
    height: 50px;
}
.buttonFollow:hover {
    cursor: pointer;
}
</style>
