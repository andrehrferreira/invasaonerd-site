<template>
  <h3 :style="{ fontSize: fontSize }" class="pa-2 tab-title"><slot></slot></h3>
</template>

<script>
export default {
  props: {
    fontSize: {
      type: String,
      required: false,
      default: '32px'
    }
  }
}
</script>

<style scoped>
.tab-title {
  letter-spacing: 2px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
}
</style>
