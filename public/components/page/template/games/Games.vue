<template>
    <InPageContainer
        type="games"
        title="Jogos"
        show-button-bottom
        show-delete
        show-edit
    >
        <template v-if="isMain">
            <InSwiper
                :key-item="key"
                :slides-per-view="1"
                :items="games"
                grab-cursor
                effect="coverflow"
            >
                <template v-slot:default="game">
                    <InSharedBanner
                        v-bind="formatItem(game)"
                        @click="select(game)"
                    ></InSharedBanner>
                </template>
            </InSwiper>
        </template>
        <v-layout v-else row wrap>
            <v-flex v-for="game in games" :key="game.id" pa-2>
                <InSharedBanner
                    v-bind="formatItem(game)"
                    @click="select(game)"
                ></InSharedBanner>
            </v-flex>
        </v-layout>
        <template v-if="dialog">
            <v-layout justify-center>
                <InGameDetails :game="gameItem" @close-modal="close" />
            </v-layout>
        </template>
        <template v-slot:edit>
            <InEditorGames :games="games" />
        </template>
    </InPageContainer>
</template>

<script>
import InPageContainer from '@/components/page/utils/PageContainer'
import InSharedBanner from '../shared/SharedBanner'
import InGameDetails from './GameDetails'
import pageEdit from '@/mixins/pageEdit'
import scrollPageTo from '@/mixins/scrollPageTo'
import InEditorGames from './EditorGames'
import InSwiper from '@/components/app/Swiper'
export default {
    components: {
        InGameDetails,
        InPageContainer,
        InSharedBanner,
        InEditorGames,
        InSwiper
    },
    mixins: [scrollPageTo, pageEdit],
    props: {
        games: {
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
            gameItem: {},
            dialog: false,
            key: 0
        }
    },

    methods: {
        formatItem(item) {
            return {
                name: item.name,
                cover: (item.cover || { url: item.url }).url,
                date: new Date(item.first_release_date).toString(),
                overview: item.summary,
                voteAverage: parseFloat(item.rating / 10)
            }
        },
        select(item) {
            this.gameItem = item
            this.dialog = true
        },
        close() {
            this.dialog = false
            this.movieItem = {}
        }
    }
}
</script>

<style></style>
