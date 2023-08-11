<template>
    <PageEditorContainer :type="type" :title="title" @save="save">
        <InSwiper
            :key-item="key"
            :slides-per-view="1"
            :items="itemsLocal"
            grab-cursor
            effect="coverflow"
        >
            <template v-slot:default="item">
                <component :is="component" :item="item">
                    <v-layout
                        v-show="itemsLocal.length > 1"
                        align-center
                        justify-center
                        align-content-center
                    >
                        <v-btn outline color="primary" @click="removeItem(item)">
                            <v-icon>delete</v-icon>Remover
                        </v-btn>
                    </v-layout>
                </component>
            </template>
        </InSwiper>
        <InPageSearch
            :title="title"
            :loading="loading"
            :empty="empty"
            :search="search"
            @search="getItem"
        >
            <v-layout row wrap grid-list-lg fluid>
                <v-flex v-for="(item, index) in itemsList" :key="index">
                    <v-hover>
                        <template slot-scope="{ hover }">
                            <v-card
                                dark
                                flat
                                color="#121212"
                                :title="item.name"
                                max-width="128"
                                :class="hover ? 'in-scale-05' : ''"
                                @click.stop="selectItem(item)"
                            >
                                <in-image
                                    :src="item.poster"
                                    :alt="item.name || ''"
                                    aspect-ratio="1.4"
                                    cover
                                    height="189"
                                    width="128"
                                ></in-image>
                                <v-card-text class="px-0 py-1">
                                    <p class="mb-0 text-truncate">{{ item.name }}</p>
                                    <p
                                        class="mb-0 font-italic font-italicgrey--text caption text-truncate"
                                    >{{ item.date }}</p>
                                    <p
                                        class="mb-0 font-italic grey--text caption text-truncate"
                                    >Avaliação: {{ item.vote_average / 2 }}</p>
                                </v-card-text>
                            </v-card>
                        </template>
                    </v-hover>
                </v-flex>
            </v-layout>
        </InPageSearch>
    </PageEditorContainer>
</template>

<script>
    import { mapGetters } from 'vuex'
    import PageEditorContainer from '@/components/page/utils/PageEditorContainer'
    import InPageSearch from '@/components/page/utils/PageSearch'
    import pageEdit from '@/mixins/pageEdit'
    import InSwiper from '@/components/app/Swiper'
    import InSerieItem from '../series/SerieItem'
    import InMovieItem from '../movies/MovieItem'
    export default {
        components: {
            PageEditorContainer,
            InPageSearch,
            InSwiper,
            InSerieItem,
            InMovieItem
        },
        mixins: [pageEdit],
        props: {
            items: {
                type: Array,
                required: true,
                default: () => []
            },
            title: {
                type: String,
                required: true,
                default: () => []
            },
            endpoint: {
                type: String,
                required: true,
                default: () => []
            },
            type: {
                type: String,
                required: true,
                default: () => []
            }
        },
        data() {
            return {
                itemsLocal: Object.assign([], this.items),
                itemsList: [],
                loading: false,
                error: false,
                search: '',
                empty: false,
                key: 0
            }
        },
        computed: {
            ...mapGetters({
                page: 'getPage'
            }),
            component() {
                switch (this.type) {
                    case 'movies':
                        return 'InMovieItem'
                    default:
                        return 'InSerieItem'
                }
            }
        },
        watch: {
            page(val) {
                if (val && val.title) this.search = val.title
            },
            items() {
                this.itemsLocal = Object.assign([], this.items)
            }
        },
        beforeMount() {
            this.search = this.page.title
            this.getItem(this.search, true)
        },
        methods: {
            async getItem(search, force = false) {
                if (
                    search &&
                    (force || this.search.toLowerCase() != search.toLowerCase())
                ) {
                    this.empty = false
                    this.loading = true
                    this.search = search
                    try {
                        const data = await this.$axios.$get(
                            `${this.endpoint}?search=${encodeURIComponent(
                                this.search
                            )}`
                        )
                        const ids = this.items.map(item => item.id)
                        this.itemsList = data
                            .map(item => {
                                if (item.backdrop_path)
                                    item.cover =
                                        'https://image.tmdb.org/t/p/w500' +
                                        item.backdrop_path

                                if (item.poster_path)
                                    item.poster =
                                        'https://image.tmdb.org/t/p/w200' +
                                        item.poster_path

                                if (item.first_air_date) {
                                    item.timestamp = new Date(item.first_air_date)
                                    item.first_air_date = item.timestamp.toLocaleDateString()
                                    item.date = item.first_air_date
                                } else if (item.release_date) {
                                    item.timestamp = new Date(item.release_date)
                                    item.release_date = item.timestamp.toLocaleDateString()
                                    item.date = item.release_date
                                }
                                if (item.title) item.name = item.title
                                return item
                            })
                            .filter(item => !ids.includes(item.id))
                            .filter(item => {
                                if (this.endpoint === 'series') {
                                    return item.poster_path
                                } else if (this.endpoint == 'movies') {
                                    return item.poster_path && item.backdrop_path
                                }
                            }).sort((a, b) => b.timestamp - a.timestamp)
                        this.loading = false
                    } catch (error) {
                        this.loading = false
                        this.error = true
                    }
                } else if (search == '') {
                    this.empty = true
                }
            },
            save() {
                this.changes = {
                    type: this.type,
                    action: 'update'
                }
                this.itemsLocal = this.itemsLocal.map(item => {
                    const [day, mounth, year] = item.release_date
                        ? item.release_date.split('/')
                        : item.first_air_date.split('/')
                    const datestr = [mounth, day, year].join('/')
                    item.timestamp = new Date(datestr).getTime()
                    return item
                }).sort((a, b) => b.timestamp - a.timestamp)
                this.pageChange = {
                    [this.type]: this.itemsLocal
                }
                this.saveStore()
                this.$toast({
                    message: `Edições gravadas para envio`,
                    color: 'success',
                    icon: 'check-circle'
                })
            },
            async selectItem(item) {
                if (!item.details) {
                    try {
                        item.details = await this.$axios.$get(
                            `${this.endpoint}/details/${item.id}`
                        )
                    } catch (error) {
                        item.details = {}
                    }
                }
                this.itemsLocal.push(item)
                this.itemsList = this.itemsList.filter(b => b.id != item.id)
            },
            removeItem(item) {
                this.itemsLocal = this.itemsLocal.filter(b => b.id != item.id)
                this.itemsList.push(item)
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
