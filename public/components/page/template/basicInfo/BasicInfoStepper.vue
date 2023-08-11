<template>
    <v-stepper v-model="e1">
        <v-stepper-header>
            <template v-for="(item, index) in stepsList">
                <v-stepper-step
                    :key="'header' + index"
                    editable
                    :complete="index + 1 > index + 2"
                    :step="index + 1"
                    >{{ item.title }}</v-stepper-step
                >
                <v-divider :key="'divider' + index"></v-divider>
            </template>
        </v-stepper-header>
        <template v-if="loading && e1 > 1">
            <InLoading :svg="icons.pacman" text="Salvando as informações" />
        </template>
        <template v-if="loading && e1 == 1">
            <InLoading text="Coletando as informações da página" />
        </template>
        <v-stepper-items v-if="!loading">
            <template v-for="(item, index) in stepsList">
                <v-stepper-content :key="'body' + index" :step="index + 1">
                    <component
                        :is="item.component"
                        :xs6="xs6"
                        :fab="fab"
                        v-bind="item.data"
                        @close-modal="closeModal"
                        @change-step-next="changeStepNext"
                        @infos="getInfos"
                    />
                    <!-- <InBasicInfo /> -->
                </v-stepper-content>
            </template>
        </v-stepper-items>
    </v-stepper>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import InBasicInfo from './BasicInfo.vue'
import InEditYoutube from './EditYoutube.vue'
import InEditTwitter from './EditTwitter.vue'
import InEditInstagram from './EditInstagram.vue'
import InLoading from '@/components/app/Loading.vue'

export default {
    components: {
        InBasicInfo,
        InEditYoutube,
        InEditTwitter,
        InLoading,
        InEditInstagram
    },
    props: {
        fab: {
            type: Boolean,
            required: false,
            default: false
        },
        xs6: {
            type: Boolean,
            required: false,
            default: false
        },
        pageItem: {
            type: Object,
            required: false,
            default: null
        }
    },
    data() {
        return {
            step: 'basic-info',
            infos: {
                youtube: {}
            },
            loading: false,
            e1: 0
        }
    },
    computed: {
        ...mapGetters({ page: 'getPage' }),
        ...mapGetters({
            icons: 'app/getIcons'
        }),
        stepsList() {
            const {
                infos,
                configYoutube,
                configTwitter,
                configInstagram
            } = this
            return [
                {
                    title: 'Informações Básicas',
                    show: true,
                    component: 'InBasicInfo',
                    data: {
                        fab: false,
                        categories: []
                    }
                },
                {
                    title: 'Instagram',
                    component: 'InEditInstagram',
                    show: infos.instagram ? infos.instagram.url : false,
                    data: {
                        config: configInstagram,
                        instagram: infos.instagram
                    }
                },
                {
                    title: 'Youtube',
                    component: 'InEditYoutube',
                    show: infos.youtube ? infos.youtube.url : false,
                    data: {
                        config: configYoutube,
                        youtube: infos.youtube
                    }
                },
                {
                    title: 'Twitter',
                    component: 'InEditTwitter',
                    show: infos.twitter ? infos.twitter.url : false,
                    data: {
                        config: configTwitter,
                        twitter: infos.twitter
                    }
                }
            ].filter(i => i.show)
        },
        steps() {
            //  steps: ['basic-info', 'instagram', 'youtube', 'twitter'],
            let steps = ['basic-info']
            if (this.configInstagram) steps.push('instagram')
            if (this.configYoutube) steps.push('youtube')
            if (this.configTwitter) steps.push('twitter')
            return steps
        },
        page() {
            return (
                this.pageItem || {
                    youtube: {
                        config: {
                            limits: {
                                playlists: 30,
                                videos: 20
                            },
                            selectedConfigs: []
                        }
                    },
                    twitter: {
                        embbed: false
                    }
                }
            )
        },
        configYoutube() {
            const { page } = this
            return page.youtube ? page.youtube.config : null
        },
        configTwitter() {
            const { page } = this
            return page.twitter || null
        },
        configInstagram() {
            const { page } = this
            return page.instagram || null
        }
    },
    methods: {
        ...mapActions('page', ['setStateBasicInfo']),
        next() {
            this.$emit('next')
        },
        changeStepNext() {
            this.loading = true
            const vm = this
            setTimeout(() => {
                if (vm.stepsList.length > vm.e1) vm.e1++
                else vm.next()
                vm.loading = false
            }, 500)
        },
        getInfos(infos) {
            this.infos = infos
        },
        closeModal() {
            this.$emit('close-modal')
        }
    }
}
</script>
