<template>
    <v-flex v-if="editMode">
        <v-layout justify-end>
            <v-tooltip :open-delay="50" :close-delay="50" bottom>
                <v-btn
                    slot="activator"
                    fab
                    small
                    class="animated zoomIn faster"
                    @click.stop="redoTypeStore(type)"
                >
                    <v-icon color="success">redo</v-icon>
                </v-btn>
                <span>{{ title }}</span>
            </v-tooltip>
        </v-layout>
    </v-flex>
</template>

<script>
import pageEdit from '@/mixins/pageEdit'
export default {
    mixins: [pageEdit],
    props: {
        title: {
            type: String,
            required: true,
            default: 'Desfazer operação de removação do Box'
        },
        type: {
            type: String,
            required: true,
            default: () => ''
        }
    }
}
</script>

<style></style>
