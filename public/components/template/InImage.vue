<template>
    <v-img
        v-if="src"
        :src="src"
        :lazy-src="lazySrc"
        :width="width"
        :height="height"
        :style="style"
        :alt="alt"
        :contain="contain"
        :gradient="gradient"
        :sizes="sizes"
        :position="position"
        :transition="transition"
        :min-height="minHeight"
        :max-height="maxHeight"
        :aspect-ratio="aspectRatio"
        @click="$emit('click', $event)"
    >
        <!-- <img :src="src" :alt="alt" /> -->
        <slot></slot>
    </v-img>
</template>

<script>
export default {
    name: 'InImage',
    props: {
        backgroundColor: {
            type: String,
            default: '#efefef'
        },
        height: {
            type: [Number, String],
            default: null
        },
        width: {
            type: [Number, String],
            default: null
        },
        minHeight: {
            type: String,
            default: null
        },
        maxHeight: {
            type: String,
            default: null
        },
        lazySrc: {
            type: String,
            default: null
        },
        alt: {
            type: String,
            required: true,
            default: null
        },
        src: {
            type: String,
            default: null
        },
        gradient: {
            type: String,
            default: null
        },
        sizes: {
            type: String,
            default: null
        },
        contain: {
            type: Boolean,
            default: null
        },
        position: {
            type: String,
            default: 'center center'
        },
        transition: {
            type: [Boolean, String],
            default: 'fade-transition'
        },
        aspectRatio: {
            type: String,
            default: null
        }
    },
    computed: {
        style() {
            // The background color is used as a
            // placeholder while loading the image.
            // You can use the dominant color of the
            // image to improve perceived performance.
            // See: https://manu.ninja/dominant-colors-for-lazy-loading-images/
            const style = { backgroundColor: this.backgroundColor }

            return style
        }
    }
}
</script>

<style scoped>
img {
    display: none;
}
</style>
