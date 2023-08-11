<template>
    <section class="in-modal-editor-box-step">
        <v-container>
            <v-layout row justify-end>
                <v-layout row wrap justify-end>
                    <v-tooltip :open-delay="50" :close-delay="50" left>
                        <v-btn
                            slot="activator"
                            icon
                            flat
                            @click.stop="setStateBox(false)"
                        >
                            <v-icon large>close</v-icon>
                        </v-btn>
                        <span>Fechar</span>
                    </v-tooltip>
                </v-layout>
            </v-layout>
            <v-layout row wrap fluid>
                <v-flex
                    v-for="(type, index) in availableTypes"
                    :key="index"
                    xs12
                    sm6
                    md4
                    lg3
                    xl3
                    pa-2
                >
                    <v-card
                        height="150px"
                        :class="type.enable ? '' : 'disabled'"
                        @click.stop="type.enable ? editType(type.type) : null"
                    >
                        <v-container fill-height>
                            <v-layout justify-center align-center column>
                                <v-spacer></v-spacer>
                                <i :class="type.icon + ' fa-3x'"></i>
                                <v-spacer></v-spacer>
                                <span>{{ type.text }}</span>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import pageEdit from '@/mixins/pageEdit'
export default {
    mixins: [pageEdit],
    data() {
        return {
            types: [
                {
                    type: 'wiki',
                    icon: 'fab fa-wikipedia-w',
                    text: 'Wikipedia',
                    enable: true
                },
                {
                    type: 'books',
                    icon: 'fas fa-book',
                    text: 'Livros/Quadrinhos',
                    enable: true
                },
                {
                    type: 'movies',
                    icon: 'fab fa-imdb',
                    text: 'Filmes',
                    enable: true
                },
                {
                    type: 'series',
                    icon: 'fas fa-tv',
                    text: 'Séries',
                    enable: true
                },
                {
                    type: 'games',
                    icon: 'fas fa-gamepad',
                    text: 'Jogos',
                    enable: true
                },
                {
                    type: 'featuredVideo',
                    icon: 'fas fa-film',
                    text: 'Vídeo em Destaque',
                    enable: true
                },
                {
                    type: 'channels',
                    icon: 'fab fa-youtube',
                    text: 'Canais Relacionados',
                    enable: true
                },
                {
                    type: 'playlists',
                    icon: 'fab fa-youtube-square',
                    text: 'Playlist do Youtube',
                    enable: true
                },
                {
                    type: 'videos',
                    icon: 'fas fa-film',
                    text: 'Vídeos',
                    enable: true
                },
                {
                    type: 'lives',
                    icon: 'fab fa-twitch',
                    text: 'Lives',
                    enable: true
                },
                {
                    type: 'featuredPages',
                    icon: 'fas fa-share-alt',
                    text: 'Páginas Relacionadas',
                    enable: true
                },
                {
                    type: 'feeds',
                    icon: 'fas fa-rss-square',
                    text: 'Feeds',
                    enable: true
                },
                {
                    type: 'comments',
                    icon: 'fas fa-comments',
                    text: 'Comentários',
                    enable: false
                },
                {
                    type: 'images',
                    icon: 'fas fa-images',
                    text: 'Imagens',
                    enable: false
                },
                {
                    type: 'wallpapes',
                    icon: 'fas fa-desktop',
                    text: 'Wallpapes',
                    enable: false
                },
                {
                    type: 'products',
                    icon: 'fas fa-cart-plus',
                    text: 'Produtos',
                    enable: false
                },
                {
                    type: 'scripts',
                    icon: 'fas fa-code',
                    text: 'Scripts',
                    enable: false
                }
            ]
        }
    },
    computed: {
        ...mapGetters({ page: 'getPage' }),
        availableTypes() {
            const pageTypes = Object.keys(this.page).filter(
                key => this.page[key]
            )
            return this.types.filter(({ type }) => {
                return !pageTypes.includes(type)
            })
        }
    },
    methods: {
        ...mapActions('page', ['setStateBox'])
    }
}
</script>

<style>
.in-modal-editor-box-step {
    align-self: auto;
    position: fixed;
    background-color: rgb(35, 35, 35);
    z-index: 500;
    bottom: 0;
    margin: 0 auto;
    width: 100%;
    left: 0;
    overflow-y: scroll;
    height: 600px;
}

@media (max-width: 780px) {
    .in-modal-editor-box-step {
        height: 100%;
    }
}
</style>

<style scoped>
.v-card:hover {
    background-color: #666;
}

.disabled {
    cursor: not-allowed;
    background-color: #333333a3;
}
.disabled:hover {
    background-color: #333 !important;
}
/* .in-editor-type-box,
.in-editor-imagebox {
  height: 150px;
  cursor: pointer;
  background-color: #333;
}

.in-editor-type-box:hover {
} */

/* .in-editor-type-box div {
  text-align: center;
  margin: auto;
  padding: 10px;
} */
</style>
