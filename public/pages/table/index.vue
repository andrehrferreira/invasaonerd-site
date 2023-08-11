<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="items"
            :pagination.sync="pagination"
            :total-items="totalItems"
            :loading="loading"
            class="elevation-1"
        >
            <template v-slot:items="{ item }">
                <td class="text-truncate">{{ item.title }}</td>
                <td class="text-xs-left">{{ item.user }}</td>
                <td class="text-xs-left">
                    {{ new Date(item.timestamp).toLocaleString() }}
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
            </template>
        </v-data-table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            totalItems: 0,
            items: [],
            loading: true,
            pagination: {},
            headers: [
                {
                    text: 'Título',
                    align: 'left',
                    sortable: false,
                    value: 'title'
                },
                {
                    text: 'E-mail do usuário',
                    align: 'left',
                    value: 'user',
                    sortable: false
                },
                { text: 'Data', value: 'timestamp', sortable: true },
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
        }
    },
    mounted() {
        this.getDataFromApi().then(data => {
            this.items = data.items
            this.totalItems = data.totalItems
        })
    },
    methods: {
        editItem({ _id }) {
            this.$router.push(`bugs/${_id}`)
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
                    sortBy,
                    descending,
                    page,
                    rowsPerPage
                } = this.pagination
                const { items, totalItems } = await this.$axios.$get('/bugs', {
                    params: {
                        sortBy,
                        descending,
                        page,
                        rowsPerPage
                    }
                })
                return {
                    items,
                    totalItems
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
