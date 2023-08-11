<template>
    <section class="animated fadeIn">
        <v-container v-if="editingType == 'categories'">
            <EditorCategories :categories="categories" />
        </v-container>
        <template v-else fluid>
            <v-layout row wrap>
                <v-flex v-if="editMode" xs12>
                    <v-layout justify-end>
                        <ButtonEdit
                            bottom
                            type="categories"
                            classes="mr-1"
                            title="Editar Categorias"
                        />
                    </v-layout>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex id="categories" xs12>
                    <h2 class="ma-0 pa-0">{{ categories.join(', ') }}</h2>
                    <v-layout row justify-center>
                        <v-tooltip
                            v-for="(categorie, index) of categories"
                            :key="index"
                            :open-delay="50"
                            :close-delay="50"
                            bottom
                        >
                            <v-avatar
                                slot="activator"
                                size="25"
                                color="#ef001d"
                                class="ma-1"
                            >
                                <span class="white--text caption">{{
                                    categorie.text
                                        ? categorie.text[0]
                                        : categorie[0]
                                }}</span>
                            </v-avatar>
                            <span>{{ categorie.text || categorie }}</span>
                        </v-tooltip>
                    </v-layout>
                    <p class="caption mb-0">Categorias</p>
                </v-flex>
            </v-layout>
        </template>
    </section>
</template>

<script>
import pageEdit from '@/mixins/pageEdit'
import EditorCategories from './EditorCategories'
import ButtonEdit from '../../utils/ButtonEdit'
export default {
    components: {
        EditorCategories,
        ButtonEdit
    },
    mixins: [pageEdit],
    props: {
        categories: {
            type: Array,
            required: true,
            default: () => []
        }
    }
}
</script>

<style scoped>
.v-avatar {
    cursor: pointer;
}

h2 {
    display: none;
}
</style>
