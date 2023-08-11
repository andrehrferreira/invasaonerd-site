<template>
    <InPageContainer
        type="books"
        title="Livros/Quadrinhos"
        show-button-bottom
        show-delete
        show-edit
    >
        <v-layout row wrap>
            <template v-if="isMain">
                <InSwiper :items="books" :height="260" :width="120">
                    <template v-slot:default="book">
                        <InBookItem
                            :book="book"
                            @click="seeBookDetails(book)"
                        />
                    </template>
                </InSwiper>
            </template>
            <v-layout v-else row justify-space-around wrap pa-2>
                <v-hover v-for="(item, index) in books" :key="index">
                    <template slot-scope="{ hover }">
                        <InBookItem
                            :hover="hover"
                            :book="item"
                            @click="seeBookDetails(item)"
                        />
                    </template>
                </v-hover>
            </v-layout>
        </v-layout>
        <template v-slot:edit>
            <EditorBooks :books="books" />
        </template>
        <template v-if="showDetails">
            <InBookDetails :book="book" @close-modal="closeModal" />
        </template>
    </InPageContainer>
</template>

<script>
import InBookDetails from './BookDetails'
import { mapActions } from 'vuex'
import pageEdit from '@/mixins/pageEdit'
import EditorBooks from './EditorBook'
import InBookItem from './BookItem'
import InSwiper from '@/components/app/Swiper'
import InPageContainer from '@/components/page/utils/PageContainer'

export default {
    components: {
        InBookDetails,
        EditorBooks,
        InBookItem,
        InSwiper,
        InPageContainer
    },
    mixins: [pageEdit],
    props: {
        books: {
            type: Array,
            required: true,
            default: () => []
        },
        isMain: {
            type: Boolean,
            required: false,
            dafault: true
        }
    },
    data() {
        return {
            book: {},
            showDetails: false,
            componentKey: 0
        }
    },
    methods: {
        ...mapActions('page', ['setBookDetails', 'setBookModal']),
        seeBookDetails(book) {
            this.book = book
            this.showDetails = true
        },
        resume(text) {
            return (
                text
                    .split('')
                    .filter((letter, index) => {
                        return index <= 30
                    })
                    .join('') + '...'
            )
        },
        closeModal() {
            this.book = {}
            this.showDetails = false
        }
    }
}
</script>

<style scoped>
.v-card {
    border-radius: 5px;
}
</style>
