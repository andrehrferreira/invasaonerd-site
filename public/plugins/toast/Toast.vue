<template>
    <v-snackbar
        v-model="active"
        :timeout="timeout"
        :color="color"
        :bottom="y === 'bottom'"
        :top="y === 'top'"
        :left="x === 'left'"
        :right="x === 'right'"
        :auto-height="autoHeight"
        :multi-line="multiLine"
        :vertical="vertical"
        class="application"
        :class="classes"
        @click="dismiss"
    >
        <v-layout row>
            <v-icon v-if="!!icon" dark left class="mr-4">{{ icon }}</v-icon>
            <span class="ml-2" v-html="message"></span>
        </v-layout>
        <v-layout justify-space-between>
            <v-btn v-show="queue > 0" icon @click="closeAll"
                >FECHAR TODOS [{{ queue }}]</v-btn
            >
            <v-spacer></v-spacer>
            <v-layout justify-end>
                <v-btn icon @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-layout>
        </v-layout>
    </v-snackbar>
</template>

<script>
export default {
    props: {
        x: {
            type: String,
            default: 'right'
        },
        y: {
            type: String,
            default: 'bottom'
        },
        color: {
            type: String,
            default: 'info'
        },
        icon: {
            type: String,
            default: () => ''
        },
        // eslint-disable-next-line vue/require-default-prop
        classes: {
            type: [String, Object, Array]
        },
        message: {
            type: String,
            default: () => ''
        },
        timeout: {
            type: Number,
            default: 3000
        },
        dismissable: {
            type: Boolean,
            default: true
        },
        autoHeight: {
            type: Boolean,
            default: false
        },
        multiLine: {
            type: Boolean,
            default: false
        },
        vertical: {
            type: Boolean,
            default: false
        }
    },

    data: () => ({
        active: false
    }),

    watch: {
        active: function(isActive, wasActive) {
            this.$emit('statusChange', isActive, wasActive)
        }
    },

    beforeMount() {
        this.$nextTick(() => this.show())
    },

    methods: {
        show() {
            this.active = true
        },

        close() {
            this.active = false
        },
        closeAll() {
            this.$emit('closeAll')
        },

        dismiss() {
            if (this.dismissable) {
                this.close()
            }
        }
    }
}
</script>
