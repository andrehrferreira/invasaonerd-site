<template>
    <InPageContainer
        title="Feed de Notícias"
        type="feeds"
        show-edit
        show-delete
        button-edit-bottom
    >
        <v-layout row wrap grid-list-lg fluid>
            <v-flex
                v-for="(feed, index) in items"
                :key="index"
                xs12
                sm6
                md4
                lg4
                xl4
            >
                <InFeedItem :feed="feed" />
            </v-flex>
        </v-layout>
        <v-layout justify-center>
            <v-btn
                flat
                small
                :href="feedsList.link"
                target="_blank"
                rel="noopener"
                >Ver Mais Notícias</v-btn
            >
        </v-layout>
        <template v-slot:edit>
            <InFeedEditor :url="feeds" @close-modal="closeModal" />
        </template>
    </InPageContainer>
</template>

<script>
import InPageContainer from '@/components/page/utils/PageContainer'
import InFeedItem from './FeedItem'
import InFeedEditor from './FeedEditor'
import pageEdit from '@/mixins/pageEdit'
export default {
    components: {
        InPageContainer,
        InFeedItem,
        InFeedEditor
    },
    mixins: [pageEdit],
    props: {
        feeds: {
            type: String,
            required: true,
            default: () => {}
        },
        feedsList: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    computed: {
        items() {
            const { feedsList } = this
            return feedsList && feedsList.items ? feedsList.items : []
        }
    },
    methods: {
        closeModal() {
            this.cancelEdit()
        }
    }
}
</script>

<style></style>
