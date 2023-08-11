<template>
    <section id="featuredPages">
        <v-layout row wrap>
            <v-flex xs12>
                <v-layout row wrap justify-space-between>
                    <v-flex d-flex>
                        <v-layout justify-start>
                            <h5>Preview</h5>
                        </v-layout>
                    </v-flex>
                    <v-flex d-flex>
                        <v-layout justify-end>
                            <v-tooltip
                                :open-delay="50"
                                :close-delay="50"
                                bottom
                            >
                                <v-btn
                                    slot="activator"
                                    color="success"
                                    dark
                                    icon
                                    @click.stop="save()"
                                >
                                    <v-icon>save</v-icon>
                                </v-btn>
                                <span>Salvar Páginas Relacionadas</span>
                            </v-tooltip>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12>
                <v-autocomplete
                    ref="autocomplete"
                    v-model="selected"
                    :search-input.sync="search"
                    dark
                    no-filter
                    append-icon
                    autofocus
                    :items="results"
                    hide-no-data
                    hide-selected
                    clearable
                    placeholder="Pesquisar páginas"
                    :loading="loading"
                    @input="pushSelected"
                >
                    <template slot="selection" slot-scope="data">
                        <span>{{ data.item.title }}</span>
                    </template>
                    <template slot="item" slot-scope="data">
                        <v-layout row align-center>
                            <v-avatar slot="activator" class="my-2" size="36px">
                                <img
                                    :src="data.item.miniavatar"
                                    alt="Avatar"
                                    @error="setDefaultImage"
                                />
                            </v-avatar>
                            <span class="ml-2" v-html="data.item.title"></span>
                        </v-layout>
                    </template>
                </v-autocomplete>
            </v-flex>
            <v-flex v-if="selecteds.length" xs12>
                <v-layout row wrap justify-space-around>
                    <v-chip
                        v-for="(page, index) in selecteds"
                        :key="index"
                        color="secondary"
                        class="animated zoomIn fast"
                    >
                        <v-avatar>
                            <in-image
                                :src="page.miniavatar"
                                :alt="page.title"
                                @error="setDefaultImage"
                            />
                        </v-avatar>
                        <span class="pr-2 white--text">{{ page.title }}</span>
                        <v-tooltip :open-delay="50" :close-delay="50" top>
                            <v-icon
                                slot="activator"
                                color="#ef001d"
                                small
                                @click="
                                    selecteds = selecteds.filter(
                                        selected => selected.url !== page.url
                                    )
                                "
                                >close</v-icon
                            >
                            <span>Remover</span>
                        </v-tooltip>
                    </v-chip>
                </v-layout>
            </v-flex>
        </v-layout>
    </section>
</template>

<script>
import pageEdit from '@/mixins/pageEdit'
export default {
    mixins: [pageEdit],
    props: {
        featuredPages: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    data() {
        return {
            featuredPagesLocal: this.featuredPages,
            selecteds: [],
            search: '',
            results: [],
            selected: {},
            loading: false
        }
    },
    watch: {
        search(val) {
            if (val && val.length > 2) this.updateItems(val)
            else if (val == '') {
                this.results = []
            }
        }
    },
    beforeMount() {
        this.$nextTick(() => {
            if (this.featuredPages && this.featuredPagesLocal.length)
                this.selecteds = Object.assign([], this.featuredPagesLocal)
        })
    },
    methods: {
        getOnlyTitle(string) {
            if (string.includes('(') && string.includes(')')) {
                return string.split(' (')[0]
            }
            return string
        },

        setDefaultImage(event) {
            event.target.src = '/img/avatardefault.jpeg'
        },

        pushSelected(payload) {
            if (payload) {
                if (
                    !this.selecteds.some(selected => {
                        return selected.url === payload.url
                    })
                ) {
                    this.selecteds.push(payload)
                    this.results = []
                }
                this.search = ''
                this.selected = {}
            }
        },

        save() {
            this.changes = {
                type: this.editingType,
                action: 'update'
            }
            this.pageChange = {
                featuredPages: this.selecteds
            }
            this.saveStore()
            this.$toast({
                message: `Edições das páginas relacionadas gravadas para envio`,
                color: 'success',
                icon: 'check-circle'
            })
        },

        async updateItems(search) {
            if (
                !this.loading &&
                search !== null &&
                search !== '' &&
                search.length > 2
            ) {
                try {
                    this.loading = true
                    const data = await this.$axios.$get('/search', {
                        params: { text: search }
                    })
                    const { pageId } = this.$route.params
                    this.results = data.filter(p => p.url !== pageId)
                    this.loading = false
                } catch (err) {
                    this.loading = false
                }
            }
        }
    }
}
</script>

<style></style>
