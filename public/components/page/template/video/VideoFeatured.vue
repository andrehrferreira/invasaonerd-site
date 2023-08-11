<template>
    <InPageContainer
        type="featuredVideo"
        title="Vídeo em Destaque"
        show-button-bottom
        show-delete
        show-edit
    >
        <template v-if="featuredVideo.id">
            <InEmbedView
                :auto-player="false"
                :video-id="featuredVideo.id"
                player-width="98%"
                :player-height="playerHeight"
                :is-playlist="false"
                type="youtube"
            />
        </template>
        <template v-slot:edit>
            <EditorVideoFeatured :featured-video="featuredVideo" />
        </template>
    </InPageContainer>
</template>

<script>
import InPageContainer from '@/components/page/utils/PageContainer'
import InEmbedView from '@/components/page/utils/EmbedView'
import EditorVideoFeatured from './EditorVideoFeatured'

export default {
    components: {
        InPageContainer,
        InEmbedView,
        EditorVideoFeatured
    },
    props: {
        featuredVideo: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    computed: {
        playerHeight() {
            const { $breakpoint } = this
            if ($breakpoint)
                switch ($breakpoint.name) {
                    case 'xs':
                        return '220px'
                    case 'sm':
                        return '300px'
                    case 'md':
                    case 'lg':
                    case 'xl':
                        return '500px'
                }
            return '500px'
        }
    }
}
</script>

<style></style>
