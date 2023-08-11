<template>
    <InSharedModalDetails
        :image="game.cover.url"
        :title="game.name"
        :overview="game.summary"
        :loading="loading"
        :links="game.links || {}"
        :show-add-links="false"
        @close-modal="closeModal"
        @links="addLinks"
    >
        <template v-if="videos && videos.length">
            <InPageTitle font-size="22px">Vídeos:</InPageTitle>
            <InSharedVideos :scroll="false" :is-main="true" :videos="videos" />
        </template>
        <template v-if="screenshots && screenshots.length">
            <InPageTitle font-size="22px">Screenshots:</InPageTitle>
            <InSharedGalleryView
                :key-item="keyItemImagesScreenshosts"
                :images="screenshots"
            />
        </template>
        <template v-if="artworks && artworks.length">
            <InPageTitle font-size="22px">Artworks:</InPageTitle>
            <InSharedGalleryView :key-item="keyItemImages" :images="artworks" />
        </template>
    </InSharedModalDetails>
</template>

<script>
import InPageTitle from '@/components/page/utils/PageTitle'
import InSharedModalDetails from '../shared/SharedModalDetails'
import InSharedVideos from '../shared/SharedVideos'
import InSharedGalleryView from '../shared/SharedGalleryView'
import pageEdit from '@/mixins/pageEdit'
export default {
    components: {
        InPageTitle,
        InSharedModalDetails,
        InSharedVideos,
        InSharedGalleryView
    },
    mixins: [pageEdit],
    props: {
        game: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    data() {
        return {
            modal: true,
            keyItemImagesScreenshosts: 20,
            keyItemImages: 30,
            error: false,
            loading: false,
            showSerieIndex: 0,
            traillers: []
        }
    },
    computed: {
        videos() {
            const { videos } = this.game
            return videos
                ? videos.map(game => {
                      return {
                          id: game.video_id,
                          title: game.name,
                          thumbnails: {
                              medium: {
                                  url: `https://i.ytimg.com/vi/${
                                      game.video_id
                                  }/mqdefault.jpg`
                              }
                          }
                      }
                  })
                : []
        },
        screenshots() {
            const { screenshots } = this.game
            if (screenshots && screenshots.length)
                return screenshots.map(({ url }) => ({
                    src: url
                }))
            return []
        },
        artworks() {
            const { artworks } = this.game
            if (artworks && artworks.length)
                return artworks.map(({ url }) => ({
                    src: url
                }))
            return []
        }
    },

    methods: {
        redirectTo(link) {
            window.open(link, '_blank')
        },
        closeModal() {
            this.$emit('close-modal')
        },
        toHttps: link => {
            if (link) return link.replace('http://', 'https://')
            return link
        },
        addLinks(links) {
            this.editPageGeneral({
                type: 'movies',
                key: 'id',
                value: this.movie.id,
                data: { links }
            })
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
