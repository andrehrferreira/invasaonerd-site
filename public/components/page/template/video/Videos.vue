<template>
    <InPageContainer
        :type="isPlaylist ? 'playlists' : 'videos'"
        :title="isPlaylist ? 'Playlists' : 'Vídeos'"
        show-button-bottom
        :show-delete="false"
    >
        <InPageContent>
            <InSharedVideos
                :videos="videosLocal"
                :is-main="isMain"
                :is-playlist="isPlaylist"
            >
            </InSharedVideos>
        </InPageContent>
    </InPageContainer>
</template>

<script>
import InPageContent from '@/components/page/utils/PageContent'
import InPageContainer from '@/components/page/utils/PageContainer'
import InSharedVideos from '../shared/SharedVideos'

export default {
    components: {
        InPageContent,
        InPageContainer,
        InSharedVideos
    },
    props: {
        videos: {
            type: Array,
            required: true,
            default: () => []
        },
        isMain: {
            type: Boolean,
            required: false,
            dafault: true
        },
        isPlaylist: {
            type: Boolean,
            required: false,
            dafault: false
        }
    },
    data() {
        return {
            videosLocal: Object.assign([], this.videos)
        }
    },
    watch: {
        videos() {
            this.videosLocal = Object.assign([], this.videos)
        }
    }
}
</script>
