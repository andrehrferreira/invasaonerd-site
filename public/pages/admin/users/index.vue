<template>
    <v-container align-content-start align-start justify-start>
        <v-card>
            <v-card-title>
                <h2>Gerenciar Usuários</h2>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Filtar"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table
                :headers="headers"
                :items="items"
                :pagination.sync="pagination"
                :total-items="totalItems"
                :loading="loading"
                class="elevation-1"
            >
                <template v-slot:items="{ item }">
                    <tr :class="item.blacklist ? 'red' : ''">
                        <td class="text-truncate text-no-wrap">
                            {{
                                (item.profile.local
                                    ? item.profile.local.fullname || ''
                                    : item.profile.google.fullname || ''
                                ).substring(0, 30)
                            }}
                        </td>
                        <td class="text-truncate text-no-wrap">
                            {{ item.emails.join(', ').substring(0, 30) }}
                        </td>
                        <td class="text-xs-left text-truncate">
                            {{
                                (item.profile.local
                                    ? item.profile.local.username || ''
                                    : ''
                                ).substring(0, 20)
                            }}
                        </td>
                        <td class="text-xs-left text-truncate">
                            {{ item.profile.local ? 'E-mail/senha' : '' }}
                            {{
                                item.profile.local && item.profile.google
                                    ? 'e'
                                    : ''
                            }}
                            {{ item.profile.google ? 'Google' : '' }}
                        </td>
                        <td class="justify-center layout px-0">
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-icon
                                        flat
                                        color="success"
                                        class="mr-2"
                                        v-on="on"
                                        @click.stop="editItem(item)"
                                        >remove_red_eye</v-icon
                                    >
                                </template>
                                <span>Ver mais informações</span>
                            </v-tooltip>
                        </td>
                    </tr>
                </template>
                <template v-slot:no-data>
                    <v-alert
                        v-show="notFirstRequest"
                        :value="true"
                        color="error"
                        icon="warning"
                    >
                        Não encontramos nenhum resultado com "{{ search }}" .
                    </v-alert>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    middleware: ['superadmin'],
    data() {
        return {
            totalItems: 0,
            items: [],
            loading: true,
            search: '',
            typing: null,
            pagination: {
                descending: true,
                rowsPerPage: 15,
                sortBy: 'feedbackDate'
            },
            notFirstRequest: false,
            headers: [
                {
                    text: 'Nome Completo',
                    align: 'left',
                    value: 'profile.local.fullname',
                    sortable: true
                },
                {
                    text: 'Emails',
                    align: 'left',
                    value: 'emails'
                },
                {
                    text: 'Username',
                    align: 'left',
                    value: 'profile.local.username'
                },
                {
                    text: 'Login',
                    align: 'left'
                },
                {
                    text: 'Ações',
                    align: 'center',
                    value: 'action',
                    sortable: false
                }
            ]
        }
    },
    watch: {
        pagination: {
            handler() {
                this.getDataFromApi().then(data => {
                    this.items = data.items
                    this.totalItems = data.totalItems
                })
            },
            deep: true
        },
        search() {
            if (this.typing) clearTimeout(this.typing)
            this.typing = setTimeout(() => {
                this.getDataFromApi().then(data => {
                    this.items = data.items
                    this.totalItems = data.totalItems
                })
            }, 500)
        }
    },
    mounted() {
        this.getDataFromApi().then(data => {
            this.items = data.items
            this.totalItems = data.totalItems
            this.notFirstRequest = true
            this.setLoadingFullScreen(false)
        })
    },
    methods: {
        ...mapActions(['setLoadingFullScreen']),
        editItem({ _id }) {
            this.$router.push(`/admin/users/${_id}`)
        },
        getDataFromApi() {
            this.loading = true
            return new Promise(async resolve => {
                const { sortBy, descending } = this.pagination

                let { items, totalItems } = await this.getData()
                if (this.pagination.sortBy) {
                    items = items.sort((a, b) => {
                        const sortA = a[sortBy]
                        const sortB = b[sortBy]

                        if (descending) {
                            if (sortA < sortB) return 1
                            if (sortA > sortB) return -1
                            return 0
                        } else {
                            if (sortA < sortB) return -1
                            if (sortA > sortB) return 1
                            return 0
                        }
                    })
                }

                this.loading = false
                resolve({
                    items,
                    totalItems
                })
            })
        },
        async getData() {
            try {
                const {
                    data: { items, total }
                } = await this.$axios.$get('/manage-users', {
                    params: {
                        ...this.pagination,
                        find: this.search
                    }
                })
                return {
                    items,
                    totalItems: total
                }
            } catch (e) {
                return {
                    items: [],
                    totalItems: 0
                }
            }
        }
    }
}
</script>
