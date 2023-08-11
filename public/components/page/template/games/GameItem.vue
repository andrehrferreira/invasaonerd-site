<template>
    <v-card
        dark
        flat
        color="#121212"
        :title="game.title"
        max-width="128"
        :class="hover ? 'in-scale-05' : ''"
        @click.stop="$emit('click', game)"
    >
        <in-image
            :src="game.cover.url || ''"
            :alt="game.summary || ''"
            aspect-ratio="1.4"
            cover
            height="189"
            width="128"
        ></in-image>
        <v-card-text class="px-0 py-1">
            <p class="mb-0 text-truncate">{{ game.name }}</p>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: {
        game: {
            type: Object,
            required: true,
            default: () => {}
        },
        hover: {
            type: Boolean,
            required: false,
            default: false
        }
    }
}
</script>

<style scoped>
.v-card {
    cursor: pointer;
    border-radius: 5px;
}
.in-scale-05 {
    transform: scale(1.05);
    z-index: 1;
}
</style>
