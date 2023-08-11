<template>
    <v-layout column wrap>
        <v-layout row wrap>
            <v-flex d-flex xs12>
                <v-layout justify-start>
                    <h5>Pesquisar: {{ title }}</h5>
                </v-layout>
            </v-flex>
            <v-flex sm12 sm8 md9 lg10 xl10>
                <v-text-field
                    v-model="searchLocal"
                    placeholder="Buscar por:"
                    :disabled="loading"
                    @keyup.enter="$emit('search', searchLocal)"
                ></v-text-field>
            </v-flex>
            <v-flex sm12 sm4 md3 lg2 xl2>
                <v-layout class="px-2">
                    <v-btn
                        dark
                        block
                        :loading="loading"
                        @click.stop="$emit('search', searchLocal)"
                    >
                        <v-icon class="mr-2">search</v-icon>Buscar
                    </v-btn>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-layout v-if="!empty && !loading" row wrap>
            <v-flex d-flex xs12>
                <v-layout justify-start>
                    <h5>{{ title }}</h5>
                </v-layout>
            </v-flex>
            <v-flex xs12>
                <hr />
            </v-flex>
            <v-flex v-if="!empty && !loading" xs12>
                <slot></slot>
            </v-flex>
        </v-layout>
        <v-flex>
            <template v-if="loading">
                <InLoading />
            </template>
        </v-flex>
        <v-flex v-if="empty">
            <InSearchEmpty :search="search" />
        </v-flex>
    </v-layout>
</template>

<script>
import InLoading from '@/components/app/Loading'
import InSearchEmpty from './SearchEmpty'
export default {
    components: {
        InLoading,
        InSearchEmpty
    },
    props: {
        title: {
            type: String,
            required: true,
            default: ''
        },
        search: {
            type: String,
            required: true,
            default: ''
        },
        loading: {
            type: Boolean,
            required: false,
            default: false
        },
        empty: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            searchLocal: this.search
        }
    },
    watch: {
        search(val) {
            this.searchLocal = val
        }
    }
}
</script>
