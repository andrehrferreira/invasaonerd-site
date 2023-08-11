<template>
    <v-layout row wrap>
        <v-flex
            justify-center
            xs12
            sm12
            lg3
            md4
            class="in-specialborder in-subnav"
        >
            <v-layout row wrap justify-center>
                <v-flex xs12>
                    <InAvatar
                        :avatar="page.avatar"
                        :miniavatar="page.miniavatar"
                        :alt="'Avatar ' + page.title"
                    />
                </v-flex>
                <v-flex xs12 text-xs-center>
                    <InTitle
                        :title="page.title"
                        :nickname="page.nickname"
                        :english-title="page.englishTitle"
                        :official-page="
                            page.officialPage && page.officialPage.length != 0
                        "
                    />
                </v-flex>
                <v-flex xs12 text-xs-center>
                    <InCategories :categories="page.categories" />
                </v-flex>
                <v-flex xs12 text-xs-center>
                    <InFollowPage
                        large
                        :page-id="(page.id || '').toString()"
                        :url="page.url"
                        :title="page.title"
                    />
                </v-flex>
                <v-flex xs12 text-xs-center>
                    <InShare />
                </v-flex>
            </v-layout>
            <slot name="side-order"></slot>
        </v-flex>
        <v-flex
            xs12
            sm12
            lg9
            md8
            class="in-specialborder in-subnav in-subnav-contents"
        >
            <slot name="main"></slot>
        </v-flex>
    </v-layout>
</template>

<script>
import InAvatar from './template/avatar/Avatar'
import InTitle from './template/title/Title'
import InCategories from './template/categories/Categories'
import InShare from './Share'
import InFollowPage from './FollowPage'

export default {
    components: {
        InAvatar,
        InTitle,
        InCategories,
        InShare,
        InFollowPage
    },
    props: {
        page: {
            type: Object,
            required: true,
            default: () => {}
        }
    }
}
</script>

<style scoped>
.in-subnav {
    /* margin-top: 56px; */
    background-color: #121212 !important;
}

.in-subnav-navbar {
    background-color: #232323;
    display: block;
    z-index: 120;
    min-height: 200px;
    padding-bottom: 20px;
}

.in-subnav-contents {
    background-color: #232323;
    border-left: none !important;
    padding: 0px;
    z-index: 60;
}
</style>
