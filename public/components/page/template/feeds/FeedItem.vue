<template>
    <v-layout row>
        <v-flex pa-2>
            <v-hover>
                <template slot-scope="{ hover }">
                    <v-card
                        :class="hover ? 'in-scale-05' : ''"
                        @click="redirectTo(feed.link)"
                    >
                        <v-card-title primary-title>
                            <div>
                                <div class="title">{{ feed.title }}</div>
                                <v-divider></v-divider>
                                <span class="grey--text">{{
                                    feed.creator || feed.author
                                }}</span>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            {{ feed.contentSnippet }}
                        </v-card-text>
                        <v-card-text>
                            <v-divider></v-divider>
                            <span class="grey--text"
                                >Publicação: {{ date }}</span
                            >
                        </v-card-text>
                    </v-card>
                </template>
            </v-hover>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    props: {
        feed: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    data: () => ({
        show: true
    }),
    computed: {
        date() {
            return (
                new Date(this.feed.isoDate).toLocaleDateString() +
                ' - ' +
                new Date(this.feed.isoDate).toLocaleTimeString()
            )
        }
    },
    methods: {
        redirectTo(link) {
            window.open(link, '_blank')
        }
    }
}
</script>

<style scoped>
.in-scale-05 {
    transform: scale(1.05);
    z-index: 1;
}
.v-card {
    cursor: pointer;
}
</style>
