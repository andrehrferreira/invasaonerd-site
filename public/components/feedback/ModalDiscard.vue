<template>
    <v-dialog v-model="modal" max-width="900px" persistent>
        <v-toolbar color="#212121">
            <v-toolbar-title>Confirmar Descarte</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click.stop="modal = false">
                <v-icon>close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container fluid class="container-main">
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-textarea
                    v-model="anotation"
                    autofocus
                    :rules="[rules.required, rules.length(5)]"
                    box
                    label="Informe um motivo para o descarte desta edição"
                ></v-textarea>
            </v-form>
            <v-divider></v-divider>
            <v-layout row justify-end>
                <v-btn flat @click="modal = false">Cancelar</v-btn>
                <v-btn color="primary" @click="save">Descartar</v-btn>
            </v-layout>
        </v-container>
    </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    props: {
        feedbackId: {
            type: String,
            required: false,
            default: ''
        }
    },
    data() {
        return {
            valid: true,
            modal: false,
            anotation: '',
            rules: {
                required: v => !!v || 'A justificativa é obrigatória',
                length: len => v =>
                    (v || '').length >= len ||
                    `É necessário pelo menos ${len} caracteres`
            }
        }
    },
    computed: {
        ...mapGetters('app', ['modalFeedbackDiscard'])
    },
    watch: {
        modalFeedbackDiscard(val) {
            if (this.val != this.modal) this.modal = val
        },
        modal(val) {
            if (val != this.modalFeedbackDiscard)
                this.setModalFeedbackDiscard(val)
            if (val == false) {
                this.$refs.form.reset()
                this.anotation = ''
            }
        }
    },
    methods: {
        ...mapActions('app', ['setModalFeedbackDiscard']),
        save() {
            if (this.$refs.form.validate() && this.feedbackId) {
                try {
                    this.$axios.$post(`/feedback/${this.feedbackId}`)
                    this.$toast({
                        message: 'Revisão da descartada com sucesso',
                        color: 'success',
                        icon: 'check-circle'
                    })
                    this.$emit('removed')
                    this.setModalFeedbackDiscard(false)
                } catch (error) {
                    this.$toast({
                        message: 'Falha na comunicação com o servidor',
                        color: 'red',
                        icon: 'warning'
                    })
                }
            }
        }
    }
}
</script>

<style scoped>
.container {
    background-color: #424242;
}
</style>
