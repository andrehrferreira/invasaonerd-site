<template>
    <InSharedModalDetails
        :image="'https://image.tmdb.org/t/p/w500' + season.poster_path"
        :title="season.name"
        :loading="loading"
        :overview="season.overview"
        :href="href"
        :show-add-links="false"
        @close-modal="closeModal"
    >
        <InPageTitle font-size="22px">Episódios:</InPageTitle>
        <v-layout pa-2>
            <InSwiper
                :slides-per-view="1"
                :items="seasonDetail.episodes"
                effect="coverflow"
                grab-cursor
                @prev="prev"
                @next="next"
            >
                <template v-slot:default="episode">
                    <InSharedBanner
                        v-bind="formatEpisode(episode)"
                    ></InSharedBanner>
                </template>
            </InSwiper>
        </v-layout>

        <InPageTitle v-show="guest_stars.length" font-size="22px"
            >Elenco:</InPageTitle
        >

        <v-container grid-list-sm fluid>
            <v-layout row wrap>
                <v-flex
                    v-for="(actor, index) in guest_stars"
                    :key="actor.id + '-' + index"
                    xs12
                    sm6
                    md4
                    lg4
                >
                    <v-card
                        color="transparent"
                        class="in-movie-preview-fade"
                        target="_blank"
                        :href="
                            'https://invasaonerd.com.br/page/' +
                                actor.character.split(' ').join('-')
                        "
                    >
                        <v-layout row>
                            <v-flex xs7>
                                <v-card-title>
                                    <v-layout column>
                                        <p
                                            class="title font-weight-thin m-0 p-0"
                                        >
                                            {{ actor.character }}
                                        </p>
                                        <small class="caption font-italic">
                                            {{ actor.name }}
                                        </small>
                                    </v-layout>
                                </v-card-title>
                            </v-flex>
                            <v-flex xs5>
                                <div class="p-2">
                                    <in-image
                                        :src="
                                            'https://image.tmdb.org/t/p/w200' +
                                                actor.profile_path
                                        "
                                        :alt="actor.name"
                                        container
                                    ></in-image>
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </InSharedModalDetails>
</template>

<script>
import { mapGetters } from 'vuex'
import InSwiper from '@/components/app/Swiper'
import InSharedBanner from '../shared/SharedBanner'
import InPageTitle from '@/components/page/utils/PageTitle'
import InSharedModalDetails from '../shared/SharedModalDetails'
export default {
    components: {
        InSwiper,
        InSharedBanner,
        InPageTitle,
        InSharedModalDetails
    },
    props: {
        season: {
            type: Object,
            required: true,
            default: () => {}
        },
        serie: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    data() {
        return {
            modal: true,
            seasonDetail: {},
            error: false,
            loading: true,
            showSerieIndex: 0
        }
    },
    computed: {
        ...mapGetters({
            icons: 'app/getIcons'
        }),
        style() {
            return {
                backgroundImage: `url(${
                    this.season.poster_path
                        ? 'https://image.tmdb.org/t/p/w500' +
                          this.season.poster_path
                        : ''
                })`,
                backgroundRepeat: 'no-repeat',
                borderRadius: '4px',
                backgroundSize: 'cover',
                backgroundColor: 'rgba(10,23,55,0.5)',
                backgroundAttachment: 'fixed'
            }
        },

        minHeight() {
            return {
                'min-height': '600px'
            }
        },
        href() {
            const urlBase = 'https://www.google.com.br/search?q=tv+serie+'
            const nameSerie = this.serie.original_name
                .toLowerCase()
                .split(' ')
                .join('+')
            const nameSeason = this.season.name
                .toLowerCase()
                .split(' ')
                .join('+')
            return (
                urlBase +
                nameSerie +
                '+' +
                nameSeason +
                '&source=lnms&tbm=shop&sa=X'
            )
        },
        episode() {
            const { episodes } = this.seasonDetail
            if (
                episodes &&
                this.showSerieIndex > -1 &&
                this.showSerieIndex < episodes.length
            ) {
                return episodes[this.showSerieIndex]
            }
            return {}
        },
        guest_stars() {
            const { guest_stars } = this.episode
            return guest_stars
                ? guest_stars.filter(actor => actor.profile_path)
                : []
        }
    },
    watch: {
        modal(val) {
            val || this.closeModal()
        },
        season() {
            this.getSeasonDetail()
        }
    },

    async beforeMount() {
        this.getSeasonDetail()
    },

    methods: {
        closeModal() {
            this.$emit('close-modal')
        },
        async getSeasonDetail() {
            this.loading = true
            try {
                this.seasonDetail = await this.$axios.$get(
                    `/series/season/${this.serie.id}?season=${
                        this.season.season_number
                    }`
                )
                this.loading = false
            } catch (error) {
                this.error = true
                this.loading = false
            }
        },
        formatEpisode(episode) {
            const format = {
                name: episode.name,
                cover: episode.still_path
                    ? 'https://image.tmdb.org/t/p/w500' + episode.still_path
                    : '/img/default_cover.jpg',
                date: episode.air_date,
                voteAverage: episode.vote_average,
                voteCount: episode.vote_count,
                ...episode,
                fontSize: '2em'
            }
            return format
        },
        prev() {
            if (this.showSerieIndex > 0) this.showSerieIndex--
        },
        next() {
            const { episodes } = this.seasonDetail
            if (episodes && this.showSerieIndex < episodes.length)
                this.showSerieIndex++
        }
    }
}
</script>

<style scoped>
.container-main {
    background-color: rgba(0, 0, 0, 0.8);
}
.in-modal-border {
    border: 1px solid #000;
    -webkit-box-shadow: inset 0px 0px 1px 1px rgba(255, 255, 255, 0.8);
    -moz-box-shadow: inset 0px 0px 1px 1px rgba(255, 255, 255, 0.8);
    box-shadow: inset 0px 0px 1px 1px rgba(255, 255, 255, 0.8);
    /*border:1px solid #404040;
    outline: 1px solid #000;*/
}
.in-movie-preview-fade {
    background: rgba(0, 0, 0, 1);
    background: -moz-linear-gradient(
        45deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(1, 1, 1, 1) 5%,
        rgba(18, 18, 18, 0.15) 100%
    );
    background: -webkit-gradient(
        left bottom,
        right top,
        color-stop(0%, rgba(0, 0, 0, 1)),
        color-stop(5%, rgba(1, 1, 1, 1)),
        color-stop(100%, rgba(18, 18, 18, 0.15))
    );
    background: -webkit-linear-gradient(
        45deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(1, 1, 1, 1) 5%,
        rgba(18, 18, 18, 0.15) 100%
    );
    background: -o-linear-gradient(
        45deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(1, 1, 1, 1) 5%,
        rgba(18, 18, 18, 0.15) 100%
    );
    background: -ms-linear-gradient(
        45deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(1, 1, 1, 1) 5%,
        rgba(18, 18, 18, 0.15) 100%
    );
    background: linear-gradient(
        45deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(1, 1, 1, 1) 5%,
        rgba(18, 18, 18, 0.15) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#000000', endColorstr='#121212', GradientType=1);
    height: 100%;
}
</style>
