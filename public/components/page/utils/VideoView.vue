<template>
    <v-layout row wrap>
        <v-flex id="toplay" xs12>
            <v-layout v-if="videoId" row wrap justify-end>
                <v-tooltip :open-delay="50" :close-delay="50" left>
                    <v-btn
                        slot="activator"
                        icon
                        color="#ef001c"
                        @click.stop="$emit('close')"
                    >
                        <v-icon>close</v-icon>
                    </v-btn>
                    <span>Fechar Vídeo</span>
                </v-tooltip>
            </v-layout>
            <v-flex v-if="videoId" :id="videoId" ma-2 xs12>
                <InEmbedView
                    :video-id="videoId"
                    player-width="98%"
                    :player-height="playerHeight"
                    :is-playlist="isPlaylist"
                    :type="type"
                />
            </v-flex>
        </v-flex>
    </v-layout>
</template>

<script>
import InEmbedView from './EmbedView'
export default {
    components: {
        InEmbedView
    },
    props: {
        videoId: {
            type: String,
            required: true,
            default: ''
        },
        type: {
            type: String,
            required: false,
            default: 'youtube'
        },
        playerHeight: {
            type: String,
            required: false,
            default: ''
        },
        isPlaylist: {
            type: Boolean,
            required: false,
            default: false
        }
    }
}
</script>

<style></style>
