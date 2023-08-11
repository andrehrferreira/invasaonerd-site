<template>
    <v-container align-content-start align-start justify-start>
        <v-card class="mx-auto" max-width="100%">
            <v-card-title>
                {{ bug.title }}
            </v-card-title>
            <v-card-text class="grey darken-4">
                <p
                    class="mb-0 font-italic grey--text text-truncate"
                    v-html="bug.details"
                ></p>
            </v-card-text>
            <v-card-text>
                <p v-show="bug.screenshots.length == 0">
                    Não foi fornecido nenhum feedback
                </p>
                <p>
                    Email do usuário:
                    <a :href="`mailto:${bug.user}`">{{ bug.user }}</a>
                </p>
            </v-card-text>
            <v-responsive>
                <v-carousel v-if="bug.screenshots.length">
                    <v-carousel-item
                        v-for="(item, i) in bug.screenshots"
                        :key="i"
                        :src="item"
                    ></v-carousel-item>
                </v-carousel>
            </v-responsive>
            <v-card-actions>
                <v-layout justify-end>
                    <v-btn flat @click.stop="$router.back()">Voltar</v-btn>
                    <!-- <v-btn color="primary">Marca como resolvido</v-btn> -->
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
export default {
    middleware: ['admin'],
    async asyncData({ app: { $axios }, params: { bugId }, error }) {
        try {
            const bug = await $axios.$get(`/bugs/${bugId}`)
            return {
                bug
            }
        } catch (e) {
            error({ statusCode: 404, message: 'Página não encontrada' })
        }
    }
}
</script>

<style></style>
