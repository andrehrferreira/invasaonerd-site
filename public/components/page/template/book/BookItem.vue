<template>
  <v-card
    dark
    flat
    color="#121212"
    :title="book.title"
    max-width="128"
    :class="hover ? 'in-scale-05' : ''"
    @click.stop="$emit('click', book)"
  >
    <in-image
      :src="book.thumbnail"
      :alt="book.description || ''"
      aspect-ratio="1.4"
      cover
      height="189"
      width="128"
    ></in-image>
    <v-card-text class="px-0 py-1">
      <p class="mb-0 text-truncate">{{ book.title }}</p>
      <p class="mb-0 grey--text font-italic text-truncate grey--text">
        {{ book.authors }}
      </p>
      <p v-if="book.isbn" class="mb-0 grey--text caption text-truncate">
        ISBN: {{ book.isbn.identifier }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    book: {
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
