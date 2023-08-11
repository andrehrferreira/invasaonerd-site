<template>
    <InSharedBanner v-bind="data">
        <slot></slot>
    </InSharedBanner>
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
            return {
                name: item.name,
                cover: item.cover,
                date: item.first_air_date,
                overview: item.overview,
                voteAverage: parseFloat(item.vote_average),
                voteCount: parseFloat(item.vote_count)
            }
        }
    }
}
</script>
