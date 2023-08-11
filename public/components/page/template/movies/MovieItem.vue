<template>
  <div class="pa-2">
    <InSharedBanner v-bind="data" @click="$emit('click', $event)">
      <slot></slot>
    </InSharedBanner>
  </div>
</template>

<script>
import InSharedBanner from '../shared/SharedBanner'
export default {
  components: {
    InSharedBanner
  },
  props: {
    item: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    data() {
      const { item } = this
      const dataArray = item.release_date.split('/')
      const [day, mounth, year] = dataArray
      const newDataArray = [mounth, day, year]
      return {
        name: item.title,
        cover: item.cover,
        date: newDataArray.join('/'),
        overview: item.overview,
        voteAverage: parseFloat(item.vote_average),
        voteCount: parseFloat(item.vote_count)
      }
    }
  }
}
</script>
