<template>
    <div
        :key="key"
        v-swiper:mySwiper="swiperOption"
        :style="{
            overflow: overflow
        }"
        :class="{ initializing: initializing }"
    >
        <div
            :class="{
                'swiper-wrapper': true
            }"
        >
            <div
                v-for="(item, index) in items"
                :key="index"
                :style="style"
                :class="`swiper-slide ${hover ? 'swiper-slide-hover' : ''}`"
            >
                <slot v-bind="item"></slot>
            </div>
        </div>
        <div class="swiper-pagination swiper-pagination-bullets"></div>
        <div v-show="direction !== 'vertical'" class="swiper-button-next"></div>
        <div v-show="direction !== 'vertical'" class="swiper-button-prev"></div>
    </div>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            default: () => []
        },
        width: {
            type: Number,
            required: false,
            default: null
        },
        height: {
            type: Number,
            required: false,
            default: null
        },
        slidesPerView: {
            type: Number,
            required: false,
            default: null
        },
        grabCursor: {
            type: Boolean,
            required: false,
            default: false
        },
        spaceBetween: {
            type: Number,
            required: false,
            default: null
        },
        type: {
            type: String,
            required: false,
            default: null
        },
        effect: {
            type: String,
            required: false,
            default: null
        },
        keyItem: {
            type: Number,
            required: false,
            default: 1
        },
        breakpoints: {
            type: Object,
            required: false,
            default: () => {}
        },
        hover: {
            type: Boolean,
            required: false,
            default: true
        },
        overflow: {
            type: String,
            default: 'hidden'
        },
        direction: {
            type: String,
            default: 'horizontal'
        },
        mousewheel: Boolean
    },
    data(vm) {
        let pagination = {
            el: '.swiper-pagination'
        }
        if (this.type) pagination.type = this.type
        return {
            key: this.keyItem,
            swiperOption: {
                direction: this.direction,
                mousewheel: this.mousewheel,
                slidesPerView: this.slidesPerView || 'auto',
                grabCursor: this.grabCursor,
                pagination: pagination,
                spaceBetween: this.spaceBetween || 15,
                breakpoints: this.breakpoints,
                effect: this.effect,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                on: {
                    slideChange() {
                        const params = {
                            activeIndex: this.activeIndex,
                            progress: this.progress
                        }
                        if (this.activeIndex > vm.activeIndex)
                            vm.$emit('next', params)
                        else vm.$emit('prev', params)
                        vm.activeIndex = this.activeIndex
                        vm.$emit('change', this)
                    }
                }
            },
            activeIndex: 0,
            initializing: true
        }
    },
    computed: {
        style() {
            if (this.width && this.height) {
                return {
                    width: `${this.width}px`,
                    height: `${this.height}px`
                }
            }
            return {}
        }
    },
    watch: {
        keyItem(val) {
            this.key = val
            this.$forceUpdate()
        }
    },
    beforeMount() {
        this.$nextTick().then(() => {
            this.forceRerender()
            this.initializing = false
        })
    },
    methods: {
        forceRerender() {
            this.key += 1
            this.$forceUpdate()
        },
        slideTo(index) {
            this.mySwiper.slideTo(index, 1000, false)
        }
    }
}
</script>

<style lang="scss">
.initializing {
    .swiper-button-prev,
    .swiper-button-next {
        display: none;
    }
}
</style>

<style>
.swiper-container {
    width: 100%;
    margin-bottom: 20px;
}

.swiper-wrapper {
    width: 100%;
}
.swiper-slide-hover:hover {
    z-index: 1;
    transform: scale(1.05, 1.05);
    -webkit-transform: scale(1.05, 1.05);
    -moz-transform: scale(1.05, 1.05);
    -o-transform: scale(1.05, 1.05);
    -ms-transform: scale(1.05, 1.05);
}

.swiper-pagination-progressbar-fill {
    background-color: #ef001c !important;
}
.swiper-button-disabled {
    pointer-events: visible !important;
}
.swiper-pagination-bullet-active {
    background: #ffff !important;
}

.swiper-button-next,
.swiper-button-prev {
    background-color: rgba(0, 0, 0, 0.1);
    stroke: #ffffff;
    height: 100%;
    top: 0px;
    width: 45px;
    margin-top: 0px;
    -webkit-transition: 0.2s ease-in-out;
    -moz-transition: 0.2s ease-in-out;
    -o-transition: 0.2s ease-in-out;
    transition: 0.2s ease-in-out;
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
    background-color: rgba(0, 0, 0, 0.5);
}

.swiper-button-next {
    background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2227%22%20height%3D%2244%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%0A%20%3Cg%3E%0A%20%20%3Ctitle%3Ebackground%3C%2Ftitle%3E%0A%20%20%3Crect%20fill%3D%22none%22%20id%3D%22canvas_background%22%20height%3D%22402%22%20width%3D%22582%22%20y%3D%22-1%22%20x%3D%22-1%22%2F%3E%0A%20%3C%2Fg%3E%0A%20%3Cg%3E%0A%20%20%3Ctitle%3ELayer%201%3C%2Ftitle%3E%0A%20%20%3Cpath%20id%3D%22svg_1%22%20fill%3D%22%23ffffff%22%20d%3D%22m27%2C22l0%2C0l-22%2C22l-2.1%2C-2.1l19.9%2C-19.9l-19.9%2C-19.9l2.1%2C-2.1l22%2C22l0%2C0z%22%2F%3E%0A%20%3C%2Fg%3E%0A%3C%2Fsvg%3E');
    right: -10px;
}

.swiper-button-prev {
    background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2227%22%20height%3D%2244%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%0A%20%3Cg%3E%0A%20%20%3Ctitle%3Ebackground%3C%2Ftitle%3E%0A%20%20%3Crect%20fill%3D%22none%22%20id%3D%22canvas_background%22%20height%3D%22402%22%20width%3D%22582%22%20y%3D%22-1%22%20x%3D%22-1%22%2F%3E%0A%20%3C%2Fg%3E%0A%20%3Cg%3E%0A%20%20%3Ctitle%3ELayer%201%3C%2Ftitle%3E%0A%20%20%3Cpath%20id%3D%22svg_1%22%20fill%3D%22%23ffffff%22%20d%3D%22m0%2C22l22%2C-22l2.1%2C2.1l-19.9%2C19.9l19.9%2C19.9l-2.1%2C2.1l-22%2C-22l0%2C0l0%2C0z%22%2F%3E%0A%20%3C%2Fg%3E%0A%3C%2Fsvg%3E');
    left: -10px;
}
</style>
