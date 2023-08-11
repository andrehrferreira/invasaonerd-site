<template>
    <InModal title="Detalhes da Denúncia" type="CommmentReport" justify-end>
        <v-card-text class="grey darken-4">
            <p
                class="mb-0 font-italic grey--text text-truncate"
                v-html="report.comment.text"
            ></p>
        </v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-layout row wrap pt-2>
                <v-flex xs12 d-flex>
                    <v-select
                        v-model="report.categorie"
                        :items="categories"
                        box
                        label="Categorize esta denuncia*"
                        :rules="[v => !!v || 'A categoria é obrigatória']"
                        required
                        color="white"
                    ></v-select>
                </v-flex>
                <v-flex xs12>
                    <v-textarea
                        v-model="report.text"
                        label="Diga algo sobre isso"
                        :rules="[
                            v => v.length <= 255 || 'Maximo de 255 caracteres',
                            v => !!v || 'O motivo é obrigatório'
                        ]"
                        :counter="255"
                    ></v-textarea>
                </v-flex>
            </v-layout>
        </v-form>
        <v-btn slot="save" color="primary" @click="save">Descartar</v-btn>
    </InModal>
</template>

<script>
import InModal from '@/components/template/Modal'
import { mapActions } from 'vuex'

export default {
    components: {
        InModal
    },
    props: {
        comment: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    data() {
        return {
            valid: true,
            dialog: true,
            report: {
                categorie: '',
                text: ''
            },
            loading: false,
            categories: [
                'Nudez',
                'Violência',
                'Assédio',
                'Suicídio ou automutilação',
                'Notícia falsa',
                'Spam',
                'Vendas não autorizadas',
                'Discurso de ódio',
                'Terrorismo'
            ].sort((a, b) => (a > b ? 1 : -1))
        }
    },
    beforeMount() {
        this.report.comment = this.comment
        this.categories.push('Outros')
    },
    methods: {
        ...mapActions('app', ['setModal']),
        async save() {
            try {
                if (this.$refs.form.validate()) {
                    await this.$axios.$post('/feed/comment/report', {
                        report: this.report
                    })
                    this.$toast({
                        message:
                            'Sua denuncia foi enviada para os administradores',
                        color: 'success',
                        icon: 'info'
                    })
                    this.setModal('CommmentReport')
                }
            } catch (error) {
                this.$toast({
                    message:
                        error.message ||
                        'Ocorreu um erro na comunicação com o servidor',
                    color: 'red',
                    icon: 'warning'
                })
            }
        }
    }
}
</script>

<style></style>
