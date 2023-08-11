<template>
    <div class="embed-container">
        <template v-if="type == 'youtube'">
            <no-ssr>
                <iframe
                    :allow="allow"
                    :src="src"
                    frameborder="0"
                    allowfullscreen
                    :height="playerHeight"
                    :width="playerWidth"
                />
            </no-ssr>
        </template>
        <template v-else-if="type == 'live'">
            <TwitchPlayer :channel="videoId"></TwitchPlayer>
        </template>
    </div>
</template>

<script>
import TwitchPlayer from 'vue-twitch-player'

export default {
    components: {
        TwitchPlayer
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
        isPlaylist: {
            type: Boolean,
            required: false,
            default: false
        },
        playerHeight: {
            type: String,
            required: false,
            default: ''
        },
        playerWidth: {
            type: String,
            required: true,
            default: ''
        },
        autoPlayer: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    computed: {
        src() {
            const { type } = this
            if (type == 'youtube') {
                let finalUrl = '&enablejsapi=1&widgetid=1'
                if (this.autoPlayer) finalUrl += '&autoplay=1'
                if (this.isPlaylist) {
                    return `https://www.youtube.com/embed/videoseries?list=${
                        this.videoId
                    }&${finalUrl}`
                } else {
                    return `https://www.youtube.com/embed/${
                        this.videoId
                    }?${finalUrl}`
                }
            }
            return ''
        },
        allow() {
            return `accelerometer; ${
                this.autoPlayer ? 'autoplay;' : ''
            } encrypted-media; gyroscope; picture-in-picture`
        }
    }
}
</script>

<style>
.embed-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    max-width: 100%;
}
.embed-container iframe,
.embed-container object,
.embed-container embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
