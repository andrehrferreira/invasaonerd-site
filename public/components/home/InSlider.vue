<template>
    <v-layout row wrap class="noselect">
        <v-flex xs12>
            <h1 class="display-1 mt-3 mb-0 ml-1">
                {{ category.alias ? category.alias : category.text }}
            </h1>
        </v-flex>

        <v-flex xs12>
            <v-layout row class="pa-2" :style="styles">
                <InSwiper
                    ref="swiper"
                    overflow="visible"
                    :items="pages"
                    :height="size"
                    :width="size"
                    :key-item="0"
                    @next="next"
                >
                    <template v-slot:default="page">
                        <InPageItem :page="page" :width="size" :height="size" />
                    </template>
                </InSwiper>
            </v-layout>
        </v-flex>
        <v-flex xs12>
            <template v-if="loading">
                <v-progress-linear
                    class="my-0 py-0 animated faster text-sm-center"
                    :indeterminate="true"
                    color="#ef001c"
                    height="5"
                ></v-progress-linear>
            </template>
        </v-flex>
    </v-layout>
</template>

<script>
import InPageItem from './InPageItem'
import loadMore from '../../mixins/loadMore'

import InSwiper from '@/components/app/Swiper'
export default {
    components: {
        InPageItem,
        InSwiper
    },
    mixins: [loadMore],
    props: {
        category: {
            type: Object,
            required: true
        },
        pages: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            jobs: [],
            unsubscribe: false,
            unfollowing: '',
            loadingMoreCategorie: '',
            progress: 0,
            scrollLeft: 0,
            scrolableArea: 0,
            x: 0,
            down: false,
            nextIndex: 0
        }
    },
    computed: {
        styles() {
            return {
                'overflow-x':
                    this.$vuetify.breakpoint.width === 0
                        ? 'hidden'
                        : this.$vuetify.breakpoint.width < 500
                        ? 'auto'
                        : 'hidden',
                'overflow-y': 'hidden',
                cursor: 'grab'
            }
        },
        stylesHeight() {
            return {
                height: `${this.size}px`
            }
        },
        stylesMaxWidth() {
            return {
                'max-width': `${this.size}px`
            }
        },
        size() {
            const { breakpoint } = this.$vuetify
            let size = 280
            // switch (breakpoint.name) {
            //     case 'xl':
            //         size = 380
            //         break
            //     case 'xs':
            //         size = 280
            //         break
            //     default:
            //         break
            // }
            return size
        },
        icon() {
            return {
                'margin-top': `${this.size / 2.3}px`
            }
        },
        percent() {
            return this.pages.length / 3
        }
    },
    methods: {
        next({ activeIndex, progress }) {
            console.log({
                activeIndex,
                progress,
                category: this.category.text
            })
            this.activeIndex = activeIndex
            this.loadMore(progress, 0.75)
        }
    }
}
</script>

<style scoped>
.card-flex {
    border-radius: 5px;
}
.in-left {
    left: 0;
}
.in-right {
    right: 0;
}
.in-slider {
    position: absolute;
    z-index: 2;
    transition: all 0.2s linear;
    background-color: rgba(0, 0, 0, 0.1);
}
.in-slider-hover:hover {
    background-color: rgba(0, 0, 0, 0.8);
    cursor: pointer;
}
.noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
}
.in-slider-icon {
    text-shadow: 1px 1px grey;
}
.disabled {
    cursor: no-drop !important;
}
</style>
