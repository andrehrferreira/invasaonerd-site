<template>
    <v-layout column wrap class="noselect">
        <h1 class="display-1 mt-3 mb-0 ml-1">
            {{ category.alias ? category.alias : category.text }}
        </h1>
        <v-layout row wrap grid-list-lg fluid>
            <v-flex
                v-for="page in pages"
                :key="'panel-' + page.ref + '-' + category.text"
                xs12
                sm6
                md4
                lg3
                xl2
                class="pa-2 animated fadeIn faster"
            >
                <InPageItem :page="page" :height="size" />
            </v-flex>
        </v-layout>
        <div v-if="loading" class="animated fadeIn faster">
            <InLoading />
        </div>
    </v-layout>
</template>

<script>
import InPageItem from './InPageItem'
import InLoading from '../app/Loading'
import loadMore from '../../mixins/loadMore'
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers'

export default {
    components: {
        InPageItem,
        InLoading
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
        },
        tabIdx: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            timer: 0
        }
    },
    computed: {
        ...mapGetters({
            tab: 'app/getTab'
        }),
        size() {
            const { breakpoint } = this.$vuetify
            let size = 330
            switch (breakpoint.name) {
                case 'xl':
                    size = 380
                    break
                case 'xs':
                    size = 280
                    break
                default:
                    break
            }
            return size
        }
    },
    beforeMount() {
        this.$nextTick(() => {
            document.addEventListener('scroll', event => {
                const {
                    category: { text },
                    tab,
                    hasNext,
                    tabIdx
                } = this
                if (tab != tabIdx) return
                if (this.timer) clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    const {
                        scrollTop,
                        scrollHeight,
                        clientHeight
                    } = event.target.scrollingElement
                    const percent = scrollTop / (scrollHeight - clientHeight)
                    if (
                        tab !== 'home' &&
                        percent > 0.9 &&
                        tab === tabIdx &&
                        percent &&
                        hasNext
                    ) {
                        setTimeout(() => {
                            this.loadMore(percent)
                        }, 100)
                    }
                }, 100)
            })
        })
    }
}
</script>

<style></style>
