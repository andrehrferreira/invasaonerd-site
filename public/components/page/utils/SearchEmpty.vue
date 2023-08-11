<template>
    <v-alert :value="true" type="warning">
        <v-layout row wrap>
            <v-flex v-if="search" xs12>
                O termo de pesquisa informado não possui nenhum resultado.
            </v-flex>
            <v-flex v-else xs12>
                Nenhum termo de pesquisa foi informado. Por favor, forneça um
                termo de pesquisa.
            </v-flex>
        </v-layout>
    </v-alert>
</template>

<script>
export default {
    props: {
        search: {
            type: String,
            required: true,
            default: ''
        }
    }
}
</script>
