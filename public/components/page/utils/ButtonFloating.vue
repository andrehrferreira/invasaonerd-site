<template>
  <v-tooltip :open-delay="50" :close-delay="50" left>
    <v-btn
      slot="activator"
      small
      dark
      fab
      :color="color"
      @click.stop="$emit('open')"
    >
      <v-icon>{{ icon }}</v-icon>
    </v-btn>
    <span>{{ title }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      requried: true,
      default: 'add'
    },
    title: {
      type: String,
      requried: true,
      default: 'Adicionar'
    },
    color: {
      type: String,
      requried: true,
      default: 'primary'
    }
  }
}
</script>
