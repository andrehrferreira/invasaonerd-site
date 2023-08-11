<template>
    <InPageContainer
        type="series"
        title="Séries"
        show-button-bottom
        show-delete
        show-edit
    >
        <v-layout row wrap grid-list-lg fluid pa-2>
            <InSwiper
                :key-item="keyItem"
                :slides-per-view="1"
                :items="seriesLocal"
                grab-cursor
                effect="coverflow"
                @prev="prev"
                @next="next"
            >
                <template v-slot:default="serie">
                    <InSerieItem
                        :item="serie"
                        @showMoreInfo="showMoreInfo(serie)"
                    ></InSerieItem>
                </template>
            </InSwiper>
            <InPageTitle v-show="seasons && seasons.length"
                >Temporadas</InPageTitle
            >
            <InSwiper
                :key-item="keyItemTemporada"
                type="progressbar"
                :space-between="20"
                :slides-per-view="3"
                :items="seasons"
                grab-cursor
                :breakpoints="breakpoints"
                :height="height"
                :width="width"
            >
                <template v-slot:default="season">
                    <InSeasonItem
                        :key="season.id"
                        :season="season"
                        @click="showDetails(season)"
                    />
                </template>
            </InSwiper>
        </v-layout>
        <v-layout v-if="images.length" column>
            <InPageTitle font-size="24px"
                >Imagens de {{ serieViewItem.name }}
            </InPageTitle>
            <InSharedGalleryView :key-item="keyItemImages" :images="images" />
        </v-layout>
        <template v-if="dialog">
            <v-layout justify-center>
                <InSerieDetails
                    :season="seasonItem"
                    :serie="serieItem"
                    @close-modal="close"
                />
            </v-layout>
        </template>
        <template v-slot:edit>
            <InSharedEditorTheMoviedb
                title="Séries"
                endpoint="series"
                type="series"
                :items="seriesLocal"
            />
        </template>
    </InPageContainer>
</template>

<script>
import scrollPageTo from '@/mixins/scrollPageTo'
import InSwiper from '@/components/app/Swiper'
import InPageContainer from '@/components/page/utils/PageContainer'
import InPageTitle from '@/components/page/utils/PageTitle'
import InSerieItem from './SerieItem'
import InSeasonItem from './SeasonItem'
import InSerieDetails from './SerieDetails'
import InSharedEditorTheMoviedb from '../shared/SharedEditorTheMoviedb'
import InSharedGalleryView from '../shared/SharedGalleryView'
import { setTimeout } from 'timers'
import pageEdit from '@/mixins/pageEdit'
export default {
    components: {
        InPageContainer,
        InSwiper,
        InSerieItem,
        InSeasonItem,
        InPageTitle,
        InSerieDetails,
        InSharedEditorTheMoviedb,
        InSharedGalleryView
    },
    mixins: [scrollPageTo, pageEdit],
    props: {
        series: {
            type: Array,
            required: true,
            default: () => []
        },
        tab: {
            type: Number,
            required: false,
            default: 0
        }
    },
    data() {
        return {
            seriesLocal: Object.assign([], this.series),
            keyItem: 1,
            keyItemTemporada: 10,
            keyItemImages: 20,
            showSerieIndex: 0,
            dialog: false,
            seasonItem: {},
            serieItem: {}
        }
    },
    computed: {
        height() {
            const { breakpoint } = this.$vuetify
            if (breakpoint.width < 560) {
                return 350
            } else {
                return 500
            }
        },
        width() {
            const { breakpoint } = this.$vuetify
            if (this.seasons.length > 3) {
                if (breakpoint.width < 780) {
                    return 342
                } else {
                    return 268
                }
            } else {
                return null
            }
        },
        serieViewItem() {
            if (
                this.showSerieIndex > -1 &&
                this.showSerieIndex < this.seriesLocal.length
            ) {
                let item = this.seriesLocal[this.showSerieIndex]
                if (!item.details) {
                    item.details = { images: [] }
                }
                return item
            }
            return { details: { images: [] } }
        },
        seasons() {
            const { details } = this.serieViewItem
            if (details && details.seasons)
                return details.seasons.filter(season => {
                    return season.name !== 'Specials' && season.poster_path
                })
            return []
        },
        images() {
            const {
                details: { images }
            } = this.serieViewItem
            if (images && images.backdrops)
                return images.backdrops.map(({ file_path }) => ({
                    src: `https://image.tmdb.org/t/p/original${file_path}`
                }))
            return []
        },
        breakpoints() {
            return {
                700: {
                    slidesPerView: 2,
                    spaceBetween: 15
                },
                500: {
                    slidesPerView: 1,
                    spaceBetween: 10
                }
            }
        }
    },
    watch: {
        tab(val) {
            this.keyItem = val
            this.keyItemTemporada = ++val
            this.keyItemImages = ++val
            this.forceRerender()
        },
        series() {
            this.seriesLocal = Object.assign([], this.series)
            this.forceRerender()
        }
    },
    beforeMount() {
        this.$nextTick().then(() => {
            this.forceRerender()
        })
    },
    methods: {
        forceRerender() {
            this.$forceUpdate()
            setTimeout(() => {
                this.keyItem += 1
                this.keyItemTemporada += 1
                this.keyItemImages += 1
                this.$forceUpdate()
            }, 100)
        },
        change(event) {
            console.log(event)
        },
        showMoreInfo(serie) {
            console.log(serie)
        },
        prev() {
            if (this.showSerieIndex > 0) this.showSerieIndex--
        },
        next() {
            if (this.showSerieIndex < this.seriesLocal.length)
                this.showSerieIndex++
        },
        close() {
            this.dialog = false
            this.seasonItem = {}
        },
        showDetails(season) {
            this.seasonItem = season
            this.serieItem = this.seriesLocal[this.showSerieIndex]
            this.dialog = true
        }
    }
}
</script>
