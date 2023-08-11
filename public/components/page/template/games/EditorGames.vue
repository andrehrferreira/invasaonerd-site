<template>
    <PageEditorContainer
        type="games"
        title="Games"
        :height="260"
        :width="120"
        @save="save"
    >
        <v-layout row wrap>
            <InSwiper :items="gamesLocal" :height="260" :width="120">
                <template v-slot:default="game">
                    <InGameItem :game="game" @click="removeItem(game)" />
                </template>
            </InSwiper>
        </v-layout>
        <InPageSearch
            title="Games"
            :loading="loading"
            :empty="empty"
            :search="search"
            @search="getGamesList"
        >
            <v-layout row wrap grid-list-lg fluid>
                <v-flex v-for="(game, index) in gamesList" :key="index">
                    <v-hover>
                        <template slot-scope="{ hover }">
                            <InGameItem
                                :hover="hover"
                                :game="game"
                                @click="selectItem(game)"
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
import { mapGetters } from 'vuex'
import pageEdit from '@/mixins/pageEdit'
import PageEditorContainer from '@/components/page/utils/PageEditorContainer'
import InPageSearch from '@/components/page/utils/PageSearch'
import InGameItem from './GameItem'
export default {
    components: {
        InSwiper,
        PageEditorContainer,
        InPageSearch,
        InGameItem
    },
    mixins: [pageEdit],
    props: {
        games: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    data() {
        return {
            gamesList: [],
            gamesLocal: Object.assign([], this.games),
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
        this.getGamesList(this.search, true)
    },
    methods: {
        async getGamesList(search, force = false) {
            if (
                search &&
                (force || this.search.toLowerCase() != search.toLowerCase())
            ) {
                this.empty = false
                this.loading = true
                this.search = search
                try {
                    const data = await this.$axios.$get(
                        `games?search=${encodeURIComponent(this.search)}`
                    )
                    this.gamesList = data
                        .filter(
                            game => !this.gamesLocal.some(b => b.id == game.id)
                        )
                        .filter(game => {
                            return game.url || (game.cover && game.cover.url)
                        }).sort((a, b) => b.first_release_date - a.first_release_date)
                    this.empty = !this.gamesList.length
                    this.loading = false
                } catch (error) {
                    this.loading = false
                    this.error = true
                }
            } else if (search == '') {
                this.empty = true
            }
        },
        selectItem(game) {
            this.gamesLocal.push(game)
            this.gamesList = this.gamesList.filter(b => b.id != game.id)
            this.empty = false
        },
        removeItem(game) {
            this.gamesLocal = this.gamesLocal.filter(b => b.id != game.id)
            this.gamesList.push(game)
            this.empty = false
        },
        save() {
            this.changes = {
                type: 'games',
                action: 'update'
            }
            
            this.pageChange = {
                games: this.gamesLocal.sort((a, b) => b.first_release_date - a.first_release_date)
            }
            this.saveStore()
            this.$toast({
                message: `Edições dos games gravadas para envio`,
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
