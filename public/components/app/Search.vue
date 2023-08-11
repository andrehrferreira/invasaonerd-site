<template>
    <v-layout align-center justify-center row fill-height>
        <v-flex xs11>
            <v-autocomplete
                ref="autocomplete"
                v-model="selected"
                :search-input.sync="search"
                :solo="solo"
                :items="results"
                hide-no-data
                :loading="loading"
                dark
                no-filter
                append-icon
                auto-select-first
                clearable
                placeholder="Pesquisar"
                @input="redirect(selected)"
                @keyup="enterSearch"
            >
                <template slot="selection" slot-scope="data">
                    <span class="ml-2" v-html="data.item.title"></span>
                </template>
                <template slot="item" slot-scope="data" class="item-search">
                    <v-layout row justify-space-between align-center>
                        <v-flex shrink>
                            <v-avatar slot="activator" class="my-2" size="36px">
                                <img
                                    :src="data.item.miniavatar"
                                    alt="Avatar"
                                    @error="setDefaultImage"
                                />
                            </v-avatar>
                        </v-flex>
                        <v-flex>
                            <p class="ml-2 mb-0 text-truncate white--text">
                                {{ data.item.title }}
                            </p>
                        </v-flex>
                        <v-flex v-show="data.item.isHistory" shrink>
                            <v-btn
                                class="ma-0 pa-1"
                                flat
                                color="secondary"
                                small
                                @click.stop="removeItemFromHistory(data.item)"
                                >remover</v-btn
                            >
                        </v-flex>
                    </v-layout>
                </template>
            </v-autocomplete>
        </v-flex>
        <v-flex
            v-if="!solo || (search !== '' && search !== null)"
            class="animated zoomIn"
        >
            <v-btn icon @click.stop="redirect(search)">
                <v-icon>search</v-icon>
            </v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    props: {
        solo: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    data() {
        return {
            search: '',
            results: [],
            history: [],
            loading: false,
            selected: '',
            noData: false,
            waitEnd: 0,
            typing: 0,
            isGetHistory: false,
            finishTyping: 500
        }
    },
    watch: {
        search(val) {
            const vue = this
            if (!this.isGetHistory) {
                this.getHistory()
            }
            if (vue.typing) clearTimeout(vue.typing)
            vue.typing = setTimeout(() => {
                this.updateItems(val)
            }, vue.finishTyping)
        }
    },
    methods: {
        ...mapActions(['setLoadingFullScreen']),
        getHistory() {
            if (localStorage.hasOwnProperty('search-history')) {
                const history = localStorage.getItem('search-history')
                    ? JSON.parse(localStorage.getItem('search-history'))
                    : []
                if (history.some(i => !i.url)) {
                    localStorage.removeItem('search-history')
                } else {
                    this.history = history
                    this.results = history
                }
            } else {
                this.noData = true
            }
            this.isGetHistory = true
        },
        removeItemFromHistory(search) {
            var history = JSON.parse(localStorage.getItem('search-history'))
            history = history.filter(item => {
                return item.ref !== search.ref
            })
            this.results = history
            localStorage.setItem('search-history', JSON.stringify(history))
        },

        redirect(search) {
            if (search && search.url !== null && search.url !== '') {
                search.isHistory = true
                if (localStorage.hasOwnProperty('search-history')) {
                    const history = localStorage.getItem('search-history')
                        ? JSON.parse(localStorage.getItem('search-history'))
                        : []
                    if (history.every(item => item.ref !== search.ref))
                        history.unshift(search)
                    localStorage.setItem(
                        'search-history',
                        JSON.stringify(
                            history.filter((item, index) => {
                                return index < 10
                            })
                        )
                    )
                } else {
                    localStorage.setItem(
                        'search-history',
                        JSON.stringify([search])
                    )
                }
                this.$emit('is-open')
                this.$router.push({
                    path: `/page/${search.url}`
                })
            }
        },

        enterSearch({ target, key }) {
            const { value } = target
            if (
                key === 'Enter' &&
                value.url != '' &&
                value.url != null &&
                value.url != undefined
            ) {
                this.redirect({
                    url: value,
                    ref: value,
                    title: value
                })
            } else if (key === 'Enter' && value != '') {
                this.setLoadingFullScreen(true)
                this.$router.push(`/nomatch/${value}`)
            }
        },

        setDefaultImage(event) {
            event.target.src = '/img/avatardefault.jpeg'
        },

        async updateItems(search) {
            let vm = this
            try {
                if (!vm.loading && search !== null) {
                    if (search !== '' && search.length > 2) {
                        vm.loading = true
                        const data = await vm.$axios.$get(
                            `/search?text=${search}`
                        )
                        vm.loading = false
                        if (data.length === 0) vm.noData = true
                        vm.results = data
                    }
                    vm.noData = true
                } else if (search === '') {
                    if (localStorage.hasOwnProperty('search-history')) {
                        vm.noData = false
                        vm.results = JSON.parse(
                            localStorage.getItem('search-history')
                        )
                    } else {
                        vm.noData = true
                        vm.results = []
                    }
                }
            } catch (err) {
                vm.loading = false
                this.$toast({
                    message: 'Erro de comunicação com o servidor',
                    color: 'warning',
                    icon: 'warning'
                })
            }
        }
    }
}
</script>

<style scoped>
.item-search {
    color: #ffffff !important;
}
</style>
