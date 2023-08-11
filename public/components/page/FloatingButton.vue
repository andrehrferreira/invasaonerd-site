<template>
    <div id="floatingbutton">
        <v-speed-dial
            v-show="isActiveFloatingButton && !isActiveBasicInfo"
            v-model="fab"
            bottom
            right
            fixed
            direction="top"
            transition="slide-y-reverse-transition"
        >
            <template v-slot:activator>
                <v-btn v-model="fab" dark fab>
                    <v-icon>expand_less</v-icon>
                    <v-icon>expand_more</v-icon>
                </v-btn>
            </template>
            <template v-if="!isActiveCancelButton && !isActiveBasicInfo">
                <InButtonFloating
                    icon="close"
                    title="Cancelar edição da página"
                    color="error"
                    @open="cancelEditPage"
                />
                <InButtonFloating
                    icon="add"
                    title="Adicionar Box"
                    color="info"
                    @open="setStateBox"
                />
                <InButtonFloating
                    icon="edit"
                    title="Editar Informações Básicas"
                    color="secondary"
                    @open="setStateBasicInfo(true)"
                />
                <InButtonFloating
                    v-if="isActiveAproveButton"
                    icon="check"
                    title="Enviar para aprovaçao"
                    color="success"
                    @open="sendEdition(true)"
                />
            </template>
            <InButtonFloating
                v-if="isActiveCancelButton"
                icon="close"
                title="Cancelar edição do Box"
                color="error"
                @open="cancelEdit"
            />
        </v-speed-dial>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import InButtonFloating from './utils/ButtonFloating'
import pageEdit from '@/mixins/pageEdit'
export default {
    components: {
        InButtonFloating
    },
    mixins: [pageEdit],
    data() {
        return {
            fab: true
        }
    },
    computed: {
        ...mapGetters('page', [
            'isActiveFloatingButton',
            'isActiveCancelButton',
            'isActiveBasicInfo'
        ]),
        ...mapGetters(['isActiveAproveButton'])
    },
    methods: {
        ...mapActions('page', ['setStateBox', 'setStateBasicInfo'])
    }
}
</script>

<style>
/* This is for documentation purposes and will not be needed in your application */
#floatingbutton .v-speed-dial {
    position: fixed;
    z-index: 100;
}

#floatingbutton .v-btn--floating {
    position: relative;
}
</style>
