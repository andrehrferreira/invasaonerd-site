<template>
    <v-tabs
        v-show="!isReady"
        :key="key"
        v-model="active"
        dark
        color="#232323"
        slider-color="#ef001c"
        show-arrows
        touchless
        :centered="centered"
        class="animated fadeIn faster"
        :class="!showTab ? 'page-main-tabs' : ''"
        @change="checkTab"
    >
        <template>
            <v-tab :key="`#in-tab-main`" ripple>
                <v-icon class="mr-2" dark small>view_module</v-icon>CONTEÚDO
            </v-tab>
            <v-tab
                v-for="item in tabList"
                :key="`#in-tab-${item.title.toLowerCase()}`"
                ripple
            >
                <v-icon class="mr-2" dark small>{{ item.icon }}</v-icon>
                {{ item.title }}
            </v-tab>
        </template>

        <slot></slot>
    </v-tabs>
</template>

<script>
import pageTabs from '@/mixins/pageTabs'
import scrollPageTo from '@/mixins/scrollPageTo'
import { mapGetters, mapActions } from 'vuex'
export default {
    mixins: [pageTabs, scrollPageTo],
    props: {
        centered: {
            type: Boolean,
            required: false,
            default: false
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
            active: 0,
            key: 0
        }
    },
    computed: {
        ...mapGetters({
            page: 'getPage',
            isReady: 'isReady'
        }),
        ...mapGetters('page', ['activeTab']),

        bp() {
            const { breakpoint } = this.$vuetify
            if (breakpoint.smAndDown) {
                return 100
            } else if (breakpoint.width <= 1500) {
                return breakpoint.width / 3
            } else {
                return 500
            }
        },
        showTab() {
            const { breakpoint } = this.$vuetify
            return !this.isMain ? true : !breakpoint.smAndDown
        }
    },
    watch: {
        page(val, old) {
            if (this.page && old && this.page.ref != old.ref) {
                this.key++
                this.$forceUpdate()
            }
        },
        active(val) {
            this.activeTab != val && this.setActiveTab(val)
        },
        activeTab(val) {
            this.active != val && (this.active = val)
        }
    },
    methods: {
        ...mapActions('app', ['goTo']),
        ...mapActions('page', ['setActiveTab']),
        checkTab(tab) {
            if (tab === 'in-tab-community' && !this.page.local) {
                this.goTo(`/page/${this.page.url}/community?p=1`)
            } else {
                this.$emit('change-key', tab)
                if (this.scroll) this.scrollPageTo('contents')
            }
        }
    }
}
</script>

<style lang="scss">
@media (max-width: 600px) {
    .page-main-tabs {
        .v-tabs__bar {
            display: none;
        }
    }
}
</style>
