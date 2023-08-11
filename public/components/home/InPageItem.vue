<template>
    <v-hover>
        <v-card
            slot-scope="{ hover }"
            :class="[
                `elevation-${hover ? 12 : 2}`,
                { 'in-card-hover': !noHover }
            ]"
            :width="width"
        >
            <in-image
                :alt="page.title"
                :src="page.avatar"
                cover
                :lazy-src="page.miniavatar"
                :height="height"
                :width="width"
                @error="errorLoadImage"
            >
                <v-container
                    fluid
                    fill-height
                    :class="'pa-0 ' + (hover ? 'in-fade-image' : '')"
                >
                    <v-layout wrap fill-height>
                        <a
                            ta="div"
                            class="layout wrap"
                            :href="'/page/' + page.url"
                        >
                            <v-flex xs12 pl-2 pt-2>
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <v-layout
                                            row
                                            justify-space-between
                                            mt-1
                                            class="in-fade-image title"
                                        >
                                            <v-flex pa-1 pr-2>
                                                <v-avatar>
                                                    <v-img
                                                        :src="page.miniavatar"
                                                    />
                                                </v-avatar>
                                            </v-flex>
                                            <v-flex
                                                xs11
                                                class="in-card-title"
                                                align-content-center
                                                justify-center
                                                pt-2
                                            >
                                                <v-layout
                                                    row
                                                    wrap
                                                    justify-start
                                                    align-center
                                                >
                                                    <v-flex xs12 pb-0>
                                                        <span
                                                            class="title white--text font-weight-thin"
                                                        >
                                                            {{ page.title }}
                                                        </span>
                                                    </v-flex>
                                                    <v-flex
                                                        v-show="page.nickname"
                                                        pt-0
                                                    >
                                                        <span
                                                            class="caption white--text"
                                                            >({{
                                                                page.nickname
                                                            }})</span
                                                        >
                                                    </v-flex>
                                                </v-layout>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex
                                v-show="hover && showSummary"
                                xs12
                                px-3
                                :class="hover ? 'animated fadeIn faster' : ''"
                            >
                                <p
                                    class="white--text text-xs-justify ma-0 pa-1 body-1"
                                    v-html="formatSummary(page.summary)"
                                ></p>
                            </v-flex>

                            <v-flex
                                v-if="showFollow"
                                :class="{
                                    'in-page-item-buttons': isMini,
                                    hovered: hover
                                }"
                                xs12
                                px-3
                                pb-3
                            >
                                <v-layout
                                    :class="{ 'in-appear': isMini }"
                                    row
                                    wrap
                                    justify-space-between
                                    align-end
                                    fill-height
                                >
                                    <v-layout
                                        row
                                        xs12
                                        px-3
                                        pb-3
                                        v-bind="styleSignUp"
                                    >
                                        <v-tooltip
                                            :open-delay="50"
                                            :close-delay="50"
                                            bottom
                                        >
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                    v-if="
                                                        showHideSuggestionButtom
                                                    "
                                                    icon
                                                    color="black"
                                                    v-on="on"
                                                    @click.prevent.stop="
                                                        $emit(
                                                            'hide-suggestion',
                                                            page
                                                        )
                                                    "
                                                >
                                                    <v-icon
                                                        >visibility_off</v-icon
                                                    >
                                                </v-btn>
                                            </template>
                                            <span
                                                >Não ver mais
                                                {{ page.title }}</span
                                            >
                                        </v-tooltip>

                                        <InFollowPage
                                            :url="page.url"
                                            :justify="justify"
                                            :page-id="
                                                (page.id || '').toString()
                                            "
                                            :title="page.title"
                                            @follow="
                                                payload =>
                                                    $emit('follow', payload)
                                            "
                                        />
                                    </v-layout>
                                </v-layout>
                            </v-flex>
                        </a>
                    </v-layout>
                </v-container>
            </in-image>
        </v-card>
    </v-hover>
</template>

<script>
import InFollowPage from '../page/FollowPage'

export default {
    components: {
        InFollowPage
    },
    props: {
        page: {
            type: Object,
            require: true,
            default: () => {}
        },
        justify: {
            type: String,
            default: 'end'
        },
        // eslint-disable-next-line vue/require-default-prop
        height: {
            type: Number,
            required: false
        },
        // eslint-disable-next-line vue/require-default-prop
        width: {
            type: Number,
            required: false
        },
        showFollow: {
            type: Boolean,
            required: false,
            default: true
        },
        showSummary: {
            type: Boolean,
            default: true
        },
        noHover: Boolean,
        showHideSuggestionButtom: Boolean,
        isMini: Boolean
    },

    computed: {
        styleSignUp() {
            return {
                [`justify-${this.justify}`]: true
            }
        }
    },

    methods: {
        formatSummary(text) {
            if (text) {
                return (
                    text
                        .split(' ')
                        .filter((word, index) => {
                            return index < 25
                        })
                        .join(' ') + '...'
                )
            }
            return text
        },
        errorLoadImage() {
            // console.log(event)
        },
        goTo(url) {
            this.$router.push({
                path: `/page/${url}`
            })
        }
    }
}
</script>

<style scoped lang="scss">
a {
    text-decoration: none !important;
}
.in-card-hover {
    transition: all 0.25s linear;
    cursor: pointer;
    /*
    &:hover {
         transform: scale(1);
        margin: 0 5px;
        z-index: 1;
        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.9);
        z-index: 1000;
    }
    */
}

.in-page-item-buttons {
    display: none;
    &.hovered {
        display: block;
        position: relative;
        .in-appear {
            position: absolute;
            top: -50px;
            left: 24px;
        }
    }
}

span.headline.white--text {
    text-shadow: 1px 1px black;
}

.in-card-title {
    text-shadow: 1px 1px grey;
}

.in-fade-image {
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

.title {
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
}
</style>
