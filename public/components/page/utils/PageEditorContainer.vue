<template>
    <v-container :id="type" class="animated fadeIn py-2 in-preview">
        <v-layout row wrap justify-space-between>
            <v-flex d-flex>
                <v-layout justify-start>
                    <h5>Preview</h5>
                </v-layout>
            </v-flex>
            <v-flex d-flex>
                <v-layout justify-end>
                    <v-tooltip :open-delay="50" :close-delay="50" bottom>
                        <v-btn
                            slot="activator"
                            color="success"
                            dark
                            icon
                            @click.stop="$emit('save')"
                        >
                            <v-icon>save</v-icon>
                        </v-btn>
                        <span>Salvar {{ title }}</span>
                    </v-tooltip>
                </v-layout>
            </v-flex>
        </v-layout>
        <slot></slot>
    </v-container>
</template>

<script>
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
        }
    }
}
</script>

<style></style>
