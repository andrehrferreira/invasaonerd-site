<template>
    <v-card :title="name" @click="$emit('click')">
        <in-image
            :alt="name"
            :src="cover"
            :height="height"
            @click="$emit('click')"
        >
            <v-container
                fluid
                align-content-end
                align-end
                class="in-movie-preview-fade"
            >
                <v-layout wrap row align-end justify-end mb-5>
                    <v-flex xs12>
                        <v-layout wrap row align-content-end align-end>
                            <h2
                                :style="{ fontSize: fontSize }"
                                class="mb-0  ml-0"
                            >
                                {{ name }}
                            </h2>
                        </v-layout>
                    </v-flex>
                    <v-flex
                        xs12
                        align-content-center
                        align-center
                        class="second"
                    >
                        <v-icon
                            v-for="number in 5"
                            :key="number"
                            small
                            :color="
                                starsRate(voteAverage, number) == 'star'
                                    ? '#ffc107'
                                    : null
                            "
                            >{{ starsRate(voteAverage, number) }}</v-icon
                        >
                        &nbsp;
                        {{ (voteAverage / 2).toFixed(1) }}
                        <img v-if="isShowLogo" class="imdb_img" :src="logo" />
                        &nbsp;<small v-show="voteCount"
                            >{{ voteCount }} votos</small
                        >
                        <p class="data mb-0">
                            {{ showDate }}
                        </p>
                    </v-flex>
                    <v-flex mt-3 mb-0 pr-5>
                        <p class="in-series-img-text-p">
                            {{ formatOverview(overview) }}
                        </p>
                    </v-flex>
                    <v-flex xs12>
                        <slot></slot>
                    </v-flex>
                </v-layout>
            </v-container>
        </in-image>
    </v-card>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true,
            default: ''
        },
        cover: {
            type: String,
            required: false,
            default: '/img/default_cover.jpg'
        },
        overview: {
            type: String,
            required: false,
            default: ''
        },
        date: {
            type: String,
            required: true,
            default: ''
        },
        voteAverage: {
            type: Number,
            required: false,
            default: 0
        },
        voteCount: {
            type: Number,
            required: false,
            default: 0
        },
        isShowLogo: {
            type: Boolean,
            required: false,
            default: false
        },
        fontSize: {
            type: String,
            required: false,
            default: '2rem'
        }
    },
    computed: {
        height() {
            const { breakpoint } = this.$vuetify
            if (breakpoint.width < 768) {
                return '500px'
            } else {
                return '400px'
            }
        },
        logo() {
            return this.serie.imdb
                ? '/img/IMDB_Logo_2016.png'
                : '/img/tmdb_logo.png'
        },
        showDate() {
            const date = new Date(this.date)
            return date instanceof Date && !isNaN(date)
                ? date.toLocaleDateString()
                : this.date
        }
    },
    methods: {
        starsRate(rate, number) {
            return number <= parseInt(rate) / 2 ? 'star' : 'star_border'
        },
        formatOverview(text) {
            if (text.length === 0) {
                return text
            } else if (
                text.length > 100 &&
                this.$vuetify.breakpoint.width > 769
            ) {
                return (
                    text
                        .split(' ')
                        .slice(0, 50)
                        .join(' ') + '...'
                )
            } else if (this.$vuetify.breakpoint.width <= 769) {
                return (
                    text
                        .split(' ')
                        .slice(0, 15)
                        .join(' ') + '...'
                )
            }
            return text + '...'
        }
    }
}
</script>

<style scoped>
.v-card {
    cursor: pointer;
    border-radius: 5px;
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

h2 {
    font-weight: 700;
    letter-spacing: 1px;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
.data {
    font-size: 0.9rem;
    color: #ff3c3c;
    font-weight: 400;
    margin-left: 0.8rem;
}

.container {
    height: 100%;
    display: flex;
}

.in-movie-small {
    font-size: 14px;
    font-weight: 300;
    color: rgba(255, 255, 255, 1);
}
.imdb_img {
    height: auto;
    width: 40px;
    margin-left: 10px;
    margin-bottom: 5px;
}
.second {
    display: flex;
}
.in-series-img-text-p {
    font-size: 1rem;
    font-weight: 400;
    max-width: 95%;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
    max-height: 200px;
    overflow-y: hidden;
}
@media (max-width: 780px) {
    .in-cover img {
        top: 0px !important;
    }

    .in-page-sections h3 {
        padding: 0px;
        padding-bottom: 0px;
        font-size: 24px;
        letter-spacing: 2px;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.8);
    }

    .in-series-img-text-p {
        max-width: 100%;
    }

    h2 {
        font-size: 2.5rem;
        font-weight: 700;
        letter-spacing: 1px;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }
}
</style>
