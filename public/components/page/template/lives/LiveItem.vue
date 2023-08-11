<template>
  <v-card
    dark
    flat
    color="#121212"
    :title="stream.channel.display_name"
    pa-2
    :class="hover ? 'in-scale-05' : ''"
    @click.stop="$emit('toPlay', stream)"
  >
    <in-image
      :src="stream.preview.medium"
      :alt="stream.channel.display_name || ''"
      aspect-ratio="1.4"
      cover
    ></in-image>
    <v-card-text class="px-0 py-1">
      <p class="mb-0">
        <b>{{ stream.channel.display_name }}</b>
      </p>
      <p class="mb-0">{{ stream.channel.game }}</p>
      <p class="mb-0 grey--text ">
        Publicação: {{ new Date(stream.created_at).toLocaleString() }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    stream: {
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
