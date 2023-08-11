<template>
    <PageEditorContainer
        type="books"
        title="Livros"
        :height="260"
        :width="120"
        @save="save"
    >
        <v-layout row wrap>
            <InSwiper :items="booksLocal" :height="260" :width="120">
                <template v-slot:default="book">
                    <InBookItem :book="book" @click="removeItem(book)" />
                </template>
            </InSwiper>
        </v-layout>
        <InPageSearch
            title="Livros"
            :loading="loading"
            :empty="empty"
            :search="search"
            @search="getBooksList"
        >
            <v-layout row wrap grid-list-lg fluid>
                <v-flex v-for="(book, index) in booksList" :key="index">
                    <v-hover>
                        <template slot-scope="{ hover }">
                            <InBookItem
                                :hover="hover"
                                :book="book"
                                @click="selectItem(book)"
                            />
                        </template>
                    </v-hover>
                </v-flex>
            </v-layout>
        </InPageSearch>
    </PageEditorContainer>
</template>

<script>
import InSwiper from '@/components/app/Swiper'
import InBookItem from './BookItem'
import { mapGetters } from 'vuex'
import pageEdit from '@/mixins/pageEdit'
import PageEditorContainer from '@/components/page/utils/PageEditorContainer'
import InPageSearch from '@/components/page/utils/PageSearch'

export default {
    components: {
        InSwiper,
        InBookItem,
        PageEditorContainer,
        InPageSearch
    },
    mixins: [pageEdit],
    props: {
        books: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    data() {
        return {
            booksList: [],
            booksLocal: Object.assign([], this.books),
            loading: false,
            error: false,
            search: '',
            empty: false
        }
    },
    computed: {
        ...mapGetters({
            page: 'getPage'
        })
    },
    watch: {
        page(val) {
            if (val && val.title) this.search = val.title
        }
    },
    beforeMount() {
        this.search = this.page.title
        this.getBooksList(this.search, true)
    },
    methods: {
        async getBooksList(search, force = false) {
            if (
                search &&
                (force || this.search.toLowerCase() != search.toLowerCase())
            ) {
                this.empty = false
                this.loading = true
                this.search = search
                try {
                    const data = await this.$axios.$get(
                        `books?search=${encodeURIComponent(this.search)}`
                    )
                    this.booksList = data
                        .filter(
                            book =>
                                !this.booksLocal.some(
                                    b => b.title == book.title
                                )
                        )
                        .filter(book => {
                            return book.thumbnail
                        }).sort((a, b) => parseInt(b.publishedDate) - parseInt(a.publishedDate))
                    this.loading = false
                } catch (error) {
                    this.loading = false
                    this.error = true
                }
            } else if (search == '') {
                this.empty = true
            }
        },
        selectItem(book) {
            this.booksLocal.push(book)
            this.booksList = this.booksList.filter(b => b.title != book.title)
            this.empty = false
        },
        removeItem(book) {
            this.booksLocal = this.booksLocal.filter(b => b.title != book.title)
            this.booksList.push(book)
            this.empty = false
        },
        save() {
            this.changes = {
                type: 'books',
                action: 'update'
            }
            this.pageChange = {
                books: this.booksLocal.sort((a, b) => parseInt(b.publishedDate) - parseInt(a.publishedDate))
            }
            this.saveStore()
            this.$toast({
                message: `Edições dos livros gravadas para envio`,
                color: 'success',
                icon: 'check-circle'
            })
        }
    }
}
</script>

<style scoped>
.v-card {
    border-radius: 5px;
}

hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #666;
    margin: 1em 0;
    padding: 0;
}
</style>
