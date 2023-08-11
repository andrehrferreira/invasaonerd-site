<template>
    <v-container align-content-start align-start justify-start>
        <v-card>
            <v-card-title>
                <h2>Gerenciar Revisões</h2>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Filtar"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="items" :search="search">
                <template v-slot:items="{ item }">
                    <td>{{ item.title }}</td>
                    <td class="text-xs-left">
                        {{
                            item.user.name
                                ? item.user.name
                                : item.user.profile.fullname
                        }}
                    </td>
                    <td class="text-xs-left">
                        {{ new Date(item.editDate).toLocaleString() }}
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
                                    >edit</v-icon
                                >
                            </template>
                            <span>Revisar</span>
                        </v-tooltip>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-icon
                                    flat
                                    dark
                                    color="error"
                                    v-on="on"
                                    @click.stop="deleteItem(item)"
                                    >delete</v-icon
                                >
                            </template>
                            <span> Descartar alterações</span>
                        </v-tooltip>
                    </td>
                </template>
                <template v-slot:no-results>
                    <v-alert :value="true" color="error" icon="warning">
                        Não encontramos nenhum resultado com "{{ search }}" .
                    </v-alert>
                </template>
            </v-data-table>
        </v-card>
        <InModalDiscard :feedback-id="feedbackId" @removed="isRemoved" />
    </v-container>
</template>

<script>
import InModalDiscard from '@/components/feedback/ModalDiscard'
import loadingFullScreen from '@/mixins/loadingFullScreen'
import { mapActions } from 'vuex'

export default {
    middleware: ['admin'],
    components: {
        InModalDiscard
    },
    mixins: [loadingFullScreen],
    data() {
        return {
            search: '',

            headers: [
                {
                    text: 'Página',
                    align: 'left',
                    sortable: false,
                    value: 'title'
                },
                { text: 'Enviada', align: 'left', value: 'user.name' },
                { text: 'Data', value: 'editDate' },
                {
                    text: 'Ações',
                    align: 'center',
                    value: 'action',
                    sortable: false
                }
            ],
            feedbackId: ''
        }
    },
    async asyncData({ app: { $axios }, error }) {
        try {
            const pages = await $axios.$get(`/feedback`)
            return {
                items: pages
            }
        } catch (e) {
            error({ statusCode: 404, message: 'Página não encontrada' })
        }
    },
    methods: {
        ...mapActions('app', ['setModalFeedbackDiscard']),
        editItem({ _id }) {
            this.$router.push(`/admin/feedback/${_id}`)
        },
        deleteItem(item) {
            this.setModalFeedbackDiscard(true)
            this.feedbackId = item._id
        },
        isRemoved() {
            this.items = this.items.filter(({ _id }) => this.feedbackId != _id)
        }
    }
}
</script>

<style></style>
