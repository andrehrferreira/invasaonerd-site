<template>
    <v-toolbar fixed app height="50px">
        <v-toolbar-side-icon
            v-show="!isSearch"
            @click.stop="$emit('toggle-drawer')"
        >
            <v-icon v-html="'$vuetify.icons.menu'" />
        </v-toolbar-side-icon>
        <v-toolbar-title v-show="!isSearch">
            <v-img
                alt="logo"
                src="/img/logo/logo-white-site.png"
                contain
                width="73.5px"
            />
        </v-toolbar-title>

        <template v-if="!isSearch">
            <v-spacer />
        </template>
        <template v-if="showSearch">
            <v-btn
                v-show="showArrowLeft"
                justify-center
                align-center
                icon
                @click.stop="isSearch = false"
            >
                <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
            <Search />
        </template>
        <template v-if="!isSearch">
            <v-spacer />
        </template>
        <template v-if="!showSearch">
            <v-btn icon @click.stop="isSearch = true">
                <v-icon>$vuetify.icons.search</v-icon>
            </v-btn>
        </template>
        <template v-if="!isSearch">
            <Menu />
        </template>
    </v-toolbar>
</template>

<script>
import Menu from './Menu'
import Search from './Search'
export default {
    components: {
        Menu,
        Search
    },
    data() {
        return {
            isSearch: false
        }
    },
    computed: {
        showSearch() {
            return this.$breakpoint.width > 700 || this.isSearch
        },
        showArrowLeft() {
            return this.$breakpoint.width < 700 || this.isSearch
        }
    }
}
</script>

<style></style>
