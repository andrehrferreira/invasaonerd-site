<template>
    <v-card
        id="userpages"
        ref="userpages"
        :style="styles"
        class="mr-2 mt-2"
        :max-height="bp.height - 180"
        style="overflow-y: auto"
    >
        <v-subheader class="grey--text">Atualizações</v-subheader>
        <v-list class="py-0">
            <template v-for="(page, index) in pagesList">
                <v-list-tile
                    :key="index"
                    avatar
                    class="animated fadeIn"
                    @click.prevent.stop="openPage(page)"
                >
                    <v-badge
                        overlap
                        color="#ef001c"
                        :value="page.notifications > 0"
                    >
                        <p slot="badge" class="mb-0 caption">
                            {{
                                page.notifications > 10
                                    ? '9+'
                                    : page.notifications
                            }}
                        </p>
                        <v-tooltip :open-delay="50" :close-delay="50" right>
                            <v-avatar slot="activator" :size="32">
                                <img
                                    :src="page.miniavatar"
                                    alt=""
                                    @error="setDefaultImage"
                                />
                            </v-avatar>
                            <span v-if="page.notifications"
                                >{{ page.notifications }} atualizações</span
                            >
                            <span v-else>Sem novas atualizações</span>
                        </v-tooltip>
                    </v-badge>
                    <v-list-tile-content class="ml-3">
                        <v-list-tile-title>{{ page.title }}</v-list-tile-title>
                        <v-list-tile-sub-title v-if="page.nickname">
                            <p class="caption mb-0 grey--text">
                                {{ page.nickname }}
                            </p>
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </template>
            <div v-show="remainingPages > 0">
                <v-list-tile @click="showMore">
                    <v-list-tile-action>
                        <v-tooltip :open-delay="50" :close-delay="50" right>
                            <v-btn slot="activator" icon>
                                <v-icon color="grey--text lighten-3"
                                    >arrow_drop_down</v-icon
                                >
                            </v-btn>
                            <span>Ver mais {{ remainingPages }}</span>
                        </v-tooltip>
                    </v-list-tile-action>
                    <v-list-tile-title color="grey--text lighten-3"
                        >Ver mais {{ remainingPages }}</v-list-tile-title
                    >
                </v-list-tile>
            </div>
        </v-list>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        pages: {
            type: Array,
            required: true,
            default: () => []
        },
        styles: {
            type: Object,
            required: false,
            default: () => {}
        }
    },
    data() {
        return {
            size: 10
        }
    },
    computed: {
        ...mapGetters('auth', ['hasUserLogged']),
        bp() {
            const { breakpoint } = this.$vuetify
            return breakpoint || {}
        },
        pagesList() {
            return this.pages.slice(0, this.size)
        },
        remainingPages() {
            return this.pages.length - this.size
        }
    },
    methods: {
        setDefaultImage(event) {
            event.target.src = '/img/avatardefault.jpeg'
        },
        showMore() {
            this.size += 20
        },
        async openPage(page) {
            try {
                await this.$axios.$post(`/user/notifications/${page.id}`)
                this.$router.push(`page/${page.url}`)
            } catch (err) {}
        }
    }
}
</script>

<style></style>
