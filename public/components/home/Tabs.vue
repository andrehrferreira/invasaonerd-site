<template>
    <v-tabs
        v-show="showTab"
        v-model="active"
        :color="color"
        class="animated fadeIn faster"
        show-arrows
        centered
        @change="setTab"
    >
        <v-tabs-slider color="#ef001c" />
        <v-tab>TUDO</v-tab>
        <v-tab
            v-for="category in categoriesWithPages"
            :key="'tab-slider-' + category.text"
            >{{ category.alias ? category.alias : category.text }}</v-tab
        >
    </v-tabs>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import scrollPageTo from '@/mixins/scrollPageTo'

export default {
    mixins: [scrollPageTo],
    props: {
        color: {
            type: String,
            required: false,
            default: null
        },
        dark: {
            type: Boolean,
            required: false,
            default: true
        },
        scroll: {
            type: Boolean,
            required: false,
            default: true
        },
        isMain: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            active: 'home',
            page: {}
        }
    },
    computed: {
        ...mapGetters({
            tab: 'app/getTab',
            scrollTop: 'app/scrollTop',
            pages: 'getPages',
            categories: 'getCategories'
        }),
        categoriesWithPages() {
            return this.categories.filter(category =>
                this.pages.some(page =>
                    (page.categories || []).includes(category.text)
                )
            )
        },
        height() {
            return this.$vuetify.breakpoint.height
        },
        showTab() {
            const { breakpoint } = this.$vuetify
            return !this.isMain
                ? true
                : !(this.scrollTop > breakpoint.height / 2)
        }
    },
    watch: {
        tab(val) {
            this.active = val
            if (this.scroll) this.scrollPageTo('in-explorer')
        }
    },
    beforeMount() {
        if (this.tab) this.active = this.tab
    },
    methods: {
        ...mapActions('app', ['setTab'])
    }
}
</script>

<style></style>
