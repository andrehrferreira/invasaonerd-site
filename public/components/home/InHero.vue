<template>
    <v-img
        ref="parallax"
        :src="src"
        :src-lazy="srcLazy"
        :height="height - parseInt(height / 2)"
        dark
        cover
        gradient="to top right, rgba(0, 0, 0, 1) 0%, rgba(1, 1, 1, 1) 10%, rgba(18, 18, 18, 0.15) 100%"
        :alt="image"
        @error="e => loadNewImage(e)"
    >
        <v-layout column fill-height>
            <v-flex xs12>
                <v-layout row justify-end class="pa-2">
                    <span class="mb-0 pl-2 follow-us">
                        Siga-nos:
                        <v-tooltip :open-delay="50" :close-delay="50" bottom>
                            <v-btn
                                slot="activator"
                                icon
                                href="https://www.facebook.com/InvasaoNerd"
                                target="_blank"
                                rel="noopener"
                            >
                                <v-avatar size="30" class="mt-2">
                                    <span
                                        style="width: 100%"
                                        v-html="icons.facebook"
                                    />
                                </v-avatar>
                            </v-btn>
                            <span>Facebook</span>
                        </v-tooltip>
                        <v-tooltip :open-delay="50" :close-delay="50" bottom>
                            <v-btn
                                slot="activator"
                                icon
                                class="mx-0"
                                href="http://instagram.com/InvasaoNerd"
                                target="_blank"
                                rel="noopener"
                            >
                                <v-avatar size="30" class="mt-2">
                                    <span
                                        style="width: 100%"
                                        v-html="icons.instagram"
                                    />
                                </v-avatar>
                            </v-btn>
                            <span>Instagram</span>
                        </v-tooltip>
                        <v-tooltip :open-delay="50" :close-delay="50" bottom>
                            <v-btn
                                slot="activator"
                                icon
                                href="http://telegram.me/InvasaoNerd"
                                target="_blank"
                                rel="noopener"
                            >
                                <v-avatar size="30" class="mt-2">
                                    <span
                                        style="width: 100%"
                                        v-html="icons.telegram"
                                    />
                                </v-avatar>
                            </v-btn>
                            <span>Telegram</span>
                        </v-tooltip>
                    </span>
                </v-layout>
            </v-flex>
            <v-flex xs12>
                <v-layout align-center column justify-center>
                    <h1 class="display-2 font-weight-thin mb-3">
                        <img
                            tag="Invasão Nerd"
                            width="200px"
                            src="/img/logo/logo-256-white.png"
                        />
                    </h1>
                    <h2 class="font-weight-thin font grey--text font-italic">
                        A maior comunidade wiki nerd
                    </h2>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-img>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        const images = [
            'son-goku-mastered-ultra-instinct-79',
            'deadpool-2-movie-poster-n1',
            'no-mans-sky-8k-ultrawide-i3',
            'star-lord-cosplay-0t',
            'marvel-avengers-vs-dc-justice-league-2p',
            'iron-man-comicart-4k-yg',
            'thanos-avengers-infinity-war-5k-4q',
            'batman-5k-digital-artwork-wa',
            'hulk-arts-new-79',
            'marvel-superheroes-10-year-anniversary-artwork-9l',
            'captain-america-vs-black-panther-4k'
        ]
        return {
            image: this.getImage(images),
            images
        }
    },
    computed: {
        ...mapGetters({
            icons: 'app/getIcons'
        }),
        src() {
            const { width, height, image } = this
            return `/img/hero/${image}-${width}x${height -
                parseInt(height / 2)}.jpg`
        },
        srcLazy() {
            const { width, height, image } = this
            return `/img/hero/${image}-${parseInt(width / 10)}x${parseInt(
                (height - parseInt(height / 2)) / 10
            )}.jpg`
        },
        width() {
            return 1024
        },
        height() {
            return 768
        }
    },
    methods: {
        getImage(images) {
            return images[Math.floor(Math.random() * images.length)]
        },

        loadNewImage() {
            const { getImage, images } = this
            this.image = getImage(images)
        }
    }
}
</script>

<style scoped>
.follow-us {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
