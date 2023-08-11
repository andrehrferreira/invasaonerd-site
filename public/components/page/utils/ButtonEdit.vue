<template>
    <v-tooltip
        :open-delay="50"
        :close-delay="50"
        :right="right"
        :bottom="bottom"
    >
        <v-btn
            v-show="editMode && show"
            slot="activator"
            :class="`${classes} animated zoomIn faster`"
            fab
            dark
            small
            :style="styles"
            @click.stop="editType(type)"
        >
            <v-icon color="success">edit</v-icon>
        </v-btn>
        <span>{{ title }}</span>
    </v-tooltip>
</template>

<script>
import pageEdit from '@/mixins/pageEdit'
export default {
    mixins: [pageEdit],
    props: {
        title: {
            type: String,
            required: true,
            default: 'Editar Box'
        },
        type: {
            type: String,
            required: true,
            default: () => ''
        },
        styles: {
            type: String,
            required: false,
            default: () => {}
        },
        classes: {
            type: String,
            required: false,
            default: () => {}
        },
        right: {
            type: Boolean,
            required: false,
            default: false
        },
        bottom: {
            type: Boolean,
            required: false,
            default: false
        },
        show: {
            type: Boolean,
            required: false,
            default: true
        }
    }
}
</script>

<style></style>
