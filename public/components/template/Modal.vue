<template>
    <v-dialog v-model="modal" max-width="1000px" persistent>
        <v-toolbar color="#212121">
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click.stop="modal = false">
                <v-icon>close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container fluid class="container-main">
            <slot></slot>
            <v-divider></v-divider>
            <v-layout
                row
                :justify-end="justifyEnd"
                :justify-space-between="justifySpaceBetween"
                wrap
            >
                <v-btn v-if="showCancel" flat @click="modal = false"
                    >Cancelar</v-btn
                >
                <slot name="save"></slot>
            </v-layout>
        </v-container>
    </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
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
        justifyEnd: {
            type: Boolean,
            required: false,
            default: false
        },
        justifySpaceBetween: {
            type: Boolean,
            required: false,
            default: false
        },
        showCancel: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
        return {
            modal: false
        }
    },
    computed: {
        ...mapGetters('app', ['modalActive'])
    },
    watch: {
        modalActive(val) {
            if (val == this.type) this.modal = !this.modal
        },
        modal(val) {
            if (val != this.modalActive) this.setModal(val)
        }
    },
    methods: {
        ...mapActions('app', ['setModal'])
    }
}
</script>

<style scoped>
.container {
    background-color: #424242;
}
.container-main {
    padding: 16px !important;
}
</style>
