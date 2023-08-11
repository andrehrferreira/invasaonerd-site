<template>
    <section :ref="type" class="animated fadeIn pa-2" :style="styles">
        <v-layout row wrap>
            <UtilsButtonDelete
                v-show="showDelete && !removed"
                :title="`Remover box de ${title}`"
                :type="type"
            />
            <UtilsButtonRedo
                v-show="removed"
                :title="`Desfazer operação de remoção do box de ${title}`"
                :type="type"
            />
            <ButtonEdit
                v-if="showEdit && !removed"
                :bottom="buttonEditBottom"
                :right="buttonEditRight"
                :type="type"
                styles="position: relative;"
                :title="`Editar ${title}`"
            />
        </v-layout>
        <div :id="type">
            <InPageTitle>{{ title }}</InPageTitle>
            <template v-if="editingType != type">
                <slot></slot>
            </template>
            <template v-else-if="editingType == type">
                <slot name="edit"></slot>
            </template>
        </div>
    </section>
</template>

<script>
import UtilsButtonDelete from './ButtonDelete'
import UtilsButtonRedo from './ButtonRedo'
import ButtonEdit from './ButtonEdit'
import InPageTitle from './PageTitle'
import pageEdit from '@/mixins/pageEdit'
import typesRemoved from '@/mixins/typesRemoved'
export default {
    components: {
        UtilsButtonDelete,
        UtilsButtonRedo,
        ButtonEdit,
        InPageTitle
    },
    mixins: [pageEdit, typesRemoved],
    props: {
        title: {
            type: String,
            required: true,
            default: ''
        },
        type: {
            type: String,
            required: true,
            default: ''
        },
        buttonEditBottom: {
            type: Boolean,
            required: false,
            default: false
        },
        buttonEditRight: {
            type: Boolean,
            required: false,
            default: false
        },
        showEdit: {
            type: Boolean,
            required: false,
            default: false
        },
        showDelete: {
            type: Boolean,
            required: false,
            default: false
        }
    }
}
</script>

<style scoped>
section {
    z-index: 1;
    border-left: none;
    overflow-x: hidden;
}
</style>
