<template>
    <InModal
        title="Excluir Página"
        type="ModalPageDelete"
        justify-space-between
        :show-cancel="true"
    >
        <span>Deseja mesmo excluir a página?</span>
        <template v-slot:save>
            <v-btn color="#ef001c" :loading="loading" @click.stop="save"
                >CONFIRMAR EXCLUSÃO</v-btn
            >
        </template>
    </InModal>
</template>

<script>
import InModal from '@/components/template/Modal'
import { mapGetters, mapActions } from 'vuex'
import pageEdit from '@/mixins/pageEdit'
export default {
    components: {
        InModal
    },
    mixins: [pageEdit],
    data() {
        return {
            valid: true,

            loading: false
        }
    },
    computed: {
        ...mapGetters('auth', ['isAdmin'])
    },
    methods: {
        ...mapActions('app', ['setModal']),
        async save() {
            this.changes = {
                type: 'removed'
            }
            this.pageChange = {
                removed: true
            }
            this.saveStore()
            this.setModal('ModalPageDelete')
            await this.sendEdition(true)
        }
    }
}
</script>

<style></style>
