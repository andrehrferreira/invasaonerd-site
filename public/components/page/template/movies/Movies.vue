<template>
    <InPageContainer
        type="movies"
        title="Filmes"
        show-button-bottom
        show-delete
        show-edit
    >
        <template v-if="isMain">
            <InSwiper
                :key-item="key"
                :slides-per-view="1"
                :items="movies"
                grab-cursor
                effect="coverflow"
            >
                <template v-slot:default="movie">
                    <InMovieItem
                        :key="movie.id"
                        :item="movie"
                        @click="selectMovie(movie)"
                    />
                </template>
            </InSwiper>
        </template>
        <template v-else>
            <InMovieItem
                v-for="movie in movies"
                :key="movie.id"
                :item="movie"
                @click="selectMovie(movie)"
            />
        </template>
        <template v-if="dialog">
            <v-layout justify-center>
                <InMovieDetails :movie="movieItem" @close-modal="close" />
            </v-layout>
        </template>
        <template v-slot:edit>
            <InSharedEditorTheMoviedb
                title="Filmes"
                endpoint="movies"
                type="movies"
                :items="moviesLocal"
            />
        </template>
    </InPageContainer>
</template>

<script>
import InPageContainer from '@/components/page/utils/PageContainer'
import InMovieItem from './MovieItem'
import InMovieDetails from './MovieDetails'
import pageEdit from '@/mixins/pageEdit'
import InSharedEditorTheMoviedb from '../shared/SharedEditorTheMoviedb'
import InSwiper from '@/components/app/Swiper'
export default {
    components: {
        InPageContainer,
        InMovieItem,
        InMovieDetails,
        InSharedEditorTheMoviedb,
        InSwiper
    },
    mixins: [pageEdit],
    props: {
        movies: {
            type: Array,
            required: true,
            default: () => []
        },
        tab: {
            type: Number,
            required: false,
            default: 0
        },
        isMain: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            moviesLocal: Object.assign([], this.movies),
            keyItem: 1,
            dialog: false,
            movieItem: {},
            key: 0
        }
    },
    watch: {
        movies() {
            this.moviesLocal = Object.assign([], this.movies)
        }
    },
    methods: {
        selectMovie(movie) {
            this.dialog = true
            this.movieItem = movie
        },
        close() {
            this.dialog = false
            this.movieItem = {}
        }
    }
}
</script>

<style></style>
