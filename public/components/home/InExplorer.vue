<template>
    <v-flex id="in-explorer" xs12>
        <v-layout row wrap>
            <v-flex xs12>
                <InTabs is-main color="black" />
                <v-tabs-items v-model="active" dark touchless>
                    <v-tab-item>
                        <div
                            v-if="
                                user &&
                                    !noSuggestions.includes('explore') &&
                                    suggestions &&
                                    suggestions.length
                            "
                        >
                            <InSuggestionsBox
                                context="explore"
                                in-title="Sugestões para você"
                                :suggestions="suggestions"
                                overflow="visible"
                            />
                        </div>
                        <div
                            v-for="category in categories"
                            :key="'tab-item-slider-' + category.text"
                        >
                            <InSlider
                                :category="category"
                                :pages="
                                    pages.filter(page =>
                                        page.categories.includes(category.text)
                                    )
                                "
                            />
                        </div>
                    </v-tab-item>
                    <v-tab-item
                        v-for="(category, index) in categoriesWithPages"
                        :key="'tab-item-panel-' + category.text"
                    >
                        <InPanel
                            :tab-idx="index + 1"
                            :category="category"
                            :pages="
                                pages.filter(page =>
                                    page.categories.includes(category.text)
                                )
                            "
                        />
                    </v-tab-item>
                </v-tabs-items>
            </v-flex>
        </v-layout>
    </v-flex>
</template>

<script>
import loadingFullScreen from '@/mixins/loadingFullScreen'
import InSuggestionsBox from '@/components/app/SuggestionsBox'
import { mapGetters, mapState } from 'vuex'
import InPanel from './InPanel'
import InSlider from './InSlider'
import InTabs from './Tabs'

export default {
    components: {
        InSuggestionsBox,
        InPanel,
        InSlider,
        InTabs
    },
    mixins: [loadingFullScreen],
    data() {
        return {
            active: 0,
            page: {}
        }
    },
    computed: {
        ...mapState('auth', ['suggestions', 'user', 'noSuggestions']),
        ...mapGetters({
            tab: 'app/getTab',
            pages: 'getPages',
            categories: 'getCategories'
        }),
        categoriesWithPages() {
            return this.categories.filter(category =>
                this.pages.some(page =>
                    (page.categories || []).includes(category.text)
                )
            )
        }
    },
    watch: {
        tab(val) {
            this.active = val
        }
    }
}
</script>
