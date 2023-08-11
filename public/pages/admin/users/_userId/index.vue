<template>
    <v-container align-content-start align-start justify-start>
        <v-card class="mx-auto" max-width="100%">
            <v-list three-line subheader>
                <v-subheader>Perfil</v-subheader>
                <v-spacer></v-spacer>
            </v-list>
            <v-container grid-list-md>
                <v-layout>
                    <v-flex
                        v-for="profile in profiles"
                        :key="profile.key"
                        xs6
                        md3
                    >
                        <InUserCard :user="profile" />
                    </v-flex>
                </v-layout>
            </v-container>
            <v-divider></v-divider>
            <v-list three-line subheader>
                <v-subheader>Configurações</v-subheader>
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-checkbox v-model="user.blacklist"></v-checkbox>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Blacklist</v-list-tile-title>
                        <v-list-tile-sub-title>
                            Usuários que não pode acessar o Invasão Nerd
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-checkbox v-model="user.admin"></v-checkbox>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Admin</v-list-tile-title>
                        <v-list-tile-sub-title>
                            Usuários administradores do Invasão Nerd
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-checkbox v-model="user.superadmin"></v-checkbox>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Superadmin</v-list-tile-title>
                        <v-list-tile-sub-title>
                            Usuários super administradores no Invasão Nerd
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
            <v-card-actions>
                <v-layout justify-end>
                    <v-btn flat @click.stop="back">Voltar</v-btn>
                    <v-btn color="primary" @click.stop="save">Salvar</v-btn>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import InUserCard from '@/components/user/UserCard'
export default {
    middleware: ['superadmin'],
    components: {
        InUserCard
    },
    data() {
        return {
            valid: true,
            keyword: ''
        }
    },
    computed: {
        profiles() {
            return Object.entries(this.user.profile).map(([key, profile]) => {
                return {
                    profile,
                    key,
                    admin: this.user.admin,
                    points: this.user.points,
                    superadmin: this.user.superadmin
                }
            })
        }
    },
    async asyncData({ app: { $axios }, params: { userId }, error }) {
        try {
            // let actual = {}
            let { data } = await $axios.$get(`/manage-users/${userId}`)
            return {
                user: data,
                userId
            }
        } catch (e) {
            error({ statusCode: 404, message: 'Página não encontrada' })
        }
    },
    methods: {
        back() {
            this.$router.back()
        },
        async save() {
            try {
                await this.$axios.$put(`/manage-users/${this.userId}`, {
                    superadmin: this.user.superadmin,
                    admin: this.user.admin,
                    blacklist: this.user.blacklist
                })
                this.$toast({
                    message: 'Usuário atualizado com sucesso',
                    color: 'success',
                    icon: 'check-circle'
                })
            } catch ({ response }) {
                const msg =
                    typeof response.data == 'string'
                        ? response.data
                        : response.data.error
                this.$toast({
                    message: msg || 'Falha na comunicação com o servidor',
                    color: 'red',
                    icon: 'warning'
                })
            }
        }
    }
}
</script>
