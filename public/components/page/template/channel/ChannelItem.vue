<template>
  <v-card
    dark
    flat
    color="#121212"
    max-width="120"
    :title="channel.title"
    :class="hover ? 'in-scale-05' : ''"
    @click.stop="$emit('click')"
  >
    <v-avatar size="120px">
      <in-image
        :src="channel.thumbnails.medium.url"
        :alt="channel.description"
        cover
        width="120"
      />
    </v-avatar>
    <v-card-text px-0 py-1>
      <p :class="'mb-0 ' + (!hover ? 'text-truncate grey--text' : '')">
        {{ channel.title }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    channel: {
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
.in-scale-05 {
  transform: scale(1.05);
  z-index: 1;
}
.v-card {
  cursor: pointer;
}
</style>
