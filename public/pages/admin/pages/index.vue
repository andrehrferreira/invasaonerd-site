<template>
    <v-container align-content-start align-start justify-start>
        <v-card>
            <v-card-title>
                <h2>Gerenciar Páginas</h2>
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
                    <tr :class="item.removed ? 'red' : ''">
                        <td class="text-truncate text-no-wrap ">
                            {{ item.title }}
                        </td>
                        <td class="text-xs-left text-truncate">
                            {{ (item.nickname || '').substring(0, 20) }}
                            {{ (item.nickname || '').length > 20 ? '...' : '' }}
                        </td>
                        <td class="text-truncate text-no-wrap ">
                            {{
                                (item.categories || [])
                                    .join(', ')
                                    .substring(0, 20)
                            }}
                            {{
                                (item.categories || []).join(', ').length > 20
                                    ? '...'
                                    : ''
                            }}
                        </td>
                        <td class="text-xs-left">
                            {{ item.removed ? 'Sim' : 'Não' }}
                        </td>
                        <td class="text-xs-left">
                            {{ item.engagement ? 'Sim' : 'Não' }}
                        </td>
                        <td class="text-xs-left">
                            {{ item.seo ? 'Sim' : 'Não' }}
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
                        >Não encontramos nenhum resultado com "{{ search }}"
                        .</v-alert
                    >
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
                    text: 'Título',
                    align: 'left',
                    value: 'title',
                    sortable: true
                },
                {
                    text: 'Subtítulo',
                    align: 'left',
                    value: 'nickname'
                },
                {
                    text: 'Categorias',
                    align: 'left',
                    value: 'categories'
                },
                {
                    text: 'Deletado',
                    align: 'left',
                    value: 'removed',
                    sortable: true
                },
                {
                    text: 'Engajamento',
                    align: 'left',
                    value: 'engagement',
                    sortable: true
                },
                {
                    text: 'SEO',
                    align: 'left',
                    value: 'seo',
                    sortable: true
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
            this.$router.push(`/admin/pages/${_id}`)
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
                } = await this.$axios.$get('/manage-pages', {
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
