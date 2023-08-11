import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters('page', ['editMode', 'editingType', 'adding']),
        ...mapGetters({
            tab: 'app/getTab',
            scrollTop: 'app/scrollTop'
        }),

        items() {
            return [
                {
                    icon: 'photo_camera',
                    title: 'Instagram',
                    show: this.page.instagram
                        ? this.page.instagram.url
                        : this.adding && this.editingType == 'instagram',
                    component: 'InInstagram',
                    props: {
                        data:
                            this.page.instagram && this.page.instagram.infos
                                ? this.page.instagram.infos
                                : {},
                        url: this.page.instagram
                            ? this.page.instagram.url
                            : null
                    },
                    order: this.mainOrder.indexOf('instagram')
                },
                {
                    icon: 'import_contacts',
                    title: 'Livros',
                    show: this.page.books
                        ? this.page.books.length >0
                        : this.adding && this.editingType == 'books',
                    props: {
                        books: this.page.books ? this.page.books : [],
                        isMain: false
                    },
                    component: 'InBook',
                    order: this.mainOrder.indexOf('books')
                },
                {
                    icon: 'account_circle',
                    title: 'Relacionados',
                    show: this.page.channels
                        ? this.page.channels.length >0
                        : this.adding && this.editingType == 'channels',
                    props: {
                        channels: this.page.channels ? this.page.channels : []
                    },
                    component: 'InChannel',
                    order: this.mainOrder.indexOf('channels')
                },
                {
                    icon: 'local_movies',
                    title: 'Filmes',
                    show: this.page.movies
                        ? this.page.movies.length > 0
                        : this.adding && this.editingType == 'movies',
                    props: {
                        movies: this.page.movies ? this.page.movies : []
                    },
                    component: 'InMovies',
                    order: this.mainOrder.indexOf('movies')
                },
                {
                    icon: 'videogame_asset',
                    title: 'Jogos',
                    show: this.page.games
                        ? this.page.games.length > 0
                        : this.adding && this.editingType == 'games',
                    props: {
                        games: this.page.games ? this.page.games : []
                    },
                    component: 'InGames',
                    order: this.mainOrder.indexOf('games')
                },
                {
                    icon: 'live_tv',
                    title: 'Lives',
                    show:
                        this.page.lives && this.page.streams
                            ? this.page.streams.length > 0
                            : this.adding && this.editingType == 'lives',
                    props: {
                        streams: this.page.streams ? this.page.streams : [],
                        isPlaylist: true
                    },
                    component: 'InLives',
                    order: this.mainOrder.indexOf('lives')
                },
                {
                    icon: 'tv',
                    title: 'Séries',
                    show: this.page.series
                        ? this.page.series.length > 0
                        : this.adding && this.editingType == 'series',
                    props: {
                        series: this.page.series ? this.page.series : []
                    },
                    component: 'InSeries',
                    order: this.mainOrder.indexOf('series')
                },
                {
                    icon: 'ondemand_video',
                    title: 'Video em Destaque',
                    notTab: true,
                    show:
                        this.page.featuredVideo && this.page.featuredVideo.id
                            ? true
                            : this.adding &&
                              this.editingType == 'featuredVideo',
                    props: {
                        featuredVideo: this.page.featuredVideo
                            ? this.page.featuredVideo
                            : {}
                    },
                    component: 'InVideoFeatured',
                    order: this.mainOrder.indexOf('featuredVideo')
                },
                {
                    icon: 'ondemand_video',
                    title: 'Videos',
                    show: this.page.videos
                        ? this.page.videos.length
                        : this.adding && this.editingType == 'videos',
                    props: {
                        videos: this.page.videos ? this.page.videos : []
                    },
                    component: 'InVideos',
                    order: this.mainOrder.indexOf('videos')
                },
                {
                    icon: 'playlist_play',
                    title: 'Playlist',
                    show: this.page.playlists
                        ? this.page.playlists.length
                        : this.adding && this.editingType == 'playlists',
                    props: {
                        videos: this.page.playlists ? this.page.playlists : [],
                        isPlaylist: true
                    },
                    component: 'InVideos',
                    order: this.mainOrder.indexOf('playlists')
                },
                {
                    icon: 'list_alt',
                    title: 'Notícias',
                    notMain: true,
                    show: this.page.feeds
                        ? true
                        : this.adding && this.editingType == 'feeds',
                    props: {
                        feeds: this.page.feeds ? this.page.feeds : '',
                        feedsList: this.page.feedsList
                            ? this.page.feedsList
                            : {}
                    },
                    component: 'InFeeds',
                    order: this.mainOrder.indexOf('feeds')
                }
            ].filter(o => o.show)
        },
        tabList() {
            return this.items.filter(i => !i.notTab)
        },
        mainOrder() {
            const { mainOrder } = this.$store.getters.getOrder
            return mainOrder || []
        },
        mainList() {
            return this.items
                .filter(i => !i.notMain)
                .sort((a, b) => a.order - b.order)
        }
    }
}
