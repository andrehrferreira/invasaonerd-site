<template>
    <div v-show="!edit" class="in-social-links animated fadeIn">
        <v-layout id="basic-info" row>
            <v-tooltip
                v-if="website && website.url"
                :open-delay="50"
                :close-delay="50"
                bottom
            >
                <a
                    slot="activator"
                    class="in-social-links-icon"
                    :href="website.url"
                    target="_blank"
                    rel="noopener"
                >
                    <v-avatar
                        slot="prepend"
                        size="30"
                        @error="errorIconWebSite"
                    >
                        <in-image
                            :src="srcWebsite"
                            :alt="website.alt"
                            @error="setDefaultImage"
                        />
                    </v-avatar>
                </a>
                <span>{{ 'Website ' + website.title }}</span>
            </v-tooltip>
            <v-tooltip
                v-if="facebook"
                :open-delay="50"
                :close-delay="50"
                bottom
            >
                <a
                    slot="activator"
                    class="in-social-links-icon"
                    :href="facebook"
                    target="_blank"
                    rel="noopener"
                >
                    <v-avatar slot="prepend" size="30">
                        <span
                            style="width: 100%"
                            v-html="icons.facebook"
                        ></span>
                    </v-avatar>
                </a>
                <span>Facebook</span>
            </v-tooltip>
            <v-tooltip v-if="twitter" :open-delay="50" :close-delay="50" bottom>
                <a
                    slot="activator"
                    class="in-social-links-icon"
                    :href="twitter"
                    target="_blank"
                    rel="noopener"
                >
                    <v-avatar slot="prepend" size="30">
                        <span style="width: 100%" v-html="icons.twitter"></span>
                    </v-avatar>
                </a>
                <span>Twitter</span>
            </v-tooltip>

            <v-tooltip
                v-if="instagram"
                :open-delay="50"
                :close-delay="50"
                bottom
            >
                <a
                    slot="activator"
                    class="in-social-links-icon"
                    :href="instagram"
                    target="_blank"
                    rel="noopener"
                >
                    <v-avatar slot="prepend" size="30">
                        <span
                            style="width: 100%"
                            v-html="icons.instagram"
                        ></span>
                    </v-avatar>
                </a>
                <span>Instagram</span>
            </v-tooltip>
            <v-tooltip v-if="spotify" :open-delay="50" :close-delay="50" bottom>
                <a
                    slot="activator"
                    class="in-social-links-icon"
                    :href="spotify"
                    target="_blank"
                    rel="noopener"
                >
                    <v-avatar slot="prepend" size="30">
                        <span style="width: 100%" v-html="icons.spotify"></span>
                    </v-avatar>
                </a>
                <span>Spotify</span>
            </v-tooltip>
            <v-tooltip v-if="youtube" :open-delay="50" :close-delay="50" bottom>
                <a
                    slot="activator"
                    class="in-social-links-icon"
                    :href="youtube"
                    target="_blank"
                    rel="noopener"
                >
                    <v-avatar slot="prepend" size="30">
                        <span style="width: 100%" v-html="icons.youtube"></span>
                    </v-avatar>
                </a>
                <span>Youtube</span>
            </v-tooltip>
        </v-layout>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        edit: {
            type: Boolean,
            default: false
        },
        youtube: {
            type: String,
            required: false,
            default: null
        },
        twitter: {
            type: String,
            required: false,
            default: null
        },
        instagram: {
            type: String,
            required: false,
            default: null
        },
        spotify: {
            type: String,
            required: false,
            default: null
        },
        facebook: {
            type: String,
            required: false,
            default: null
        },
        website: {
            type: Object,
            required: false,
            default: () => ({
                url: null,
                src: null,
                title: null,
                alt: null
            })
        }
    },
    computed: {
        ...mapGetters({
            icons: 'app/getIcons'
        }),
        srcWebsite() {
            return this.website.src || '/img/avatardefault.jpeg'
        }
    },
    methods: {
        errorIconWebSite() {
            this.website.src == '/img/avatardefault.jpeg'
        },
        setDefaultImage() {
            this.website.src == '/img/avatardefault.jpeg'
        }
    }
}
</script>

<style scoped>
.in-social-links-website-text {
    bottom: -3px;
    position: relative;
}

.in-social-links {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    padding: 8px 8px;
}

.in-social-links-icon {
    position: relative;
    width: 30px;
    height: 30px;
    margin: 0 6px;
}

.in-social-links-icon > img {
    border-radius: 15px;
    margin: 0 3px;
}
</style>
