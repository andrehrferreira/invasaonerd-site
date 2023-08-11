<template>
  <v-card
    dark
    flat
    color="transparent"
    :title="video.title"
    pa-2
    :class="hover ? 'in-scale-05' : ''"
    @click.stop="$emit('toPlay', video)"
  >
    <in-image
      :src="url"
      :alt="video.title || ''"
      aspect-ratio="1.4"
      cover
    ></in-image>
    <v-card-text class="px-0 py-1">
      <p class="mb-0">{{ video.title }}</p>
      <p v-if="video.publishedAt" class="mb-0 grey--text ">
        Publicação:
        {{ new Date(video.publishedAt).toLocaleDateString() }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    video: {
      type: Object,
      required: true,
      default: () => {}
    },
    hover: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    url() {
      const { video } = this
      return video.thumbnails ? video.thumbnails.medium.url : ''
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
