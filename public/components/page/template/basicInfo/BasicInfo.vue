<template>
    <v-card color="transparent">
        <template v-if="loading">
            <InLoading text="Coletando as informações da página" />
        </template>
        <template v-else>
            <v-form>
                <v-container>
                    <v-layout row wrap>
                        <v-flex :xs6="isxs6" :xs12="!isxs6">
                            <v-text-field
                                v-model="form.website.url"
                                placeholder="Ex: https://.websiteoficial.com.br/"
                                clearable
                                label="Website Oficial"
                                type="text"
                                color="white"
                            >
                                <v-avatar
                                    v-if="form.website.icon"
                                    slot="prepend"
                                    size="35"
                                >
                                    <v-img
                                        :src="form.website.icon"
                                        alt
                                        @error="setDefaultImage"
                                    ></v-img>
                                </v-avatar>
                                <v-avatar
                                    v-else
                                    slot="prepend"
                                    class="in-modal-avatar-align"
                                    size="35"
                                >
                                    <span
                                        style="width: 35px; height: auto;"
                                        v-html="icons.website"
                                    ></span>
                                </v-avatar>
                            </v-text-field>
                        </v-flex>
                        <v-flex :xs6="isxs6" :xs12="!isxs6">
                            <v-text-field
                                v-model="form.facebook.url"
                                placeholder="Ex: https://www.facebook.com/Oficial/"
                                clearable
                                label="Facebook Oficial"
                                type="text"
                                color="#253961"
                            >
                                <v-avatar
                                    slot="prepend"
                                    class="in-modal-avatar-align"
                                    size="35"
                                >
                                    <span
                                        style="width: 35px; height: auto;"
                                        v-html="icons.facebook"
                                    ></span>
                                </v-avatar>
                            </v-text-field>
                        </v-flex>
                        <v-flex :xs6="isxs6" :xs12="!isxs6">
                            <v-text-field
                                v-model="form.youtube.url"
                                placeholder="Ex: https://www.youtube.com/user/Oficial/"
                                clearable
                                label="Canal Oficial do Youtube"
                                type="text"
                                color="#ef001c"
                                :disabled="categories.includes('Youtuber')"
                            >
                                <v-avatar
                                    slot="prepend"
                                    class="in-modal-avatar-align"
                                    size="35"
                                >
                                    <span
                                        style="width: 35px; height: auto;"
                                        v-html="icons.youtube"
                                    ></span>
                                </v-avatar>
                            </v-text-field>
                        </v-flex>
                        <v-flex :xs6="isxs6" :xs12="!isxs6">
                            <v-text-field
                                v-model="form.twitter.url"
                                placeholder="Ex: https://twitter.com/Oficial/"
                                clearable
                                label="Twitter Oficial"
                                type="text"
                                color="#55ABED"
                            >
                                <v-avatar
                                    slot="prepend"
                                    class="in-modal-avatar-align"
                                    size="35"
                                >
                                    <span
                                        style="width: 35px; height: auto;"
                                        v-html="icons.twitter"
                                    ></span>
                                </v-avatar>
                            </v-text-field>
                        </v-flex>
                        <v-flex :xs6="isxs6" :xs12="!isxs6">
                            <v-text-field
                                v-model="form.instagram.url"
                                placeholder="Ex: https://www.instagram.com/Oficial/"
                                clearable
                                label="Instagram Oficial"
                                type="text"
                                color="#FF994E"
                            >
                                <v-avatar
                                    slot="prepend"
                                    class="in-modal-avatar-align"
                                    size="35"
                                >
                                    <span
                                        style="width: 35px; height: 35px;"
                                        v-html="icons.instagram"
                                    ></span>
                                </v-avatar>
                            </v-text-field>
                        </v-flex>
                        <v-flex :xs6="isxs6" :xs12="!isxs6">
                            <v-text-field
                                v-model="form.spotify.url"
                                placeholder="Ex: https://open.spotify.com/album/Oficial"
                                clearable
                                label="Album Oficial do Spotify"
                                type="text"
                                color="#02D85F"
                            >
                                <v-avatar
                                    slot="prepend"
                                    class="in-modal-avatar-align"
                                    size="35"
                                >
                                    <span
                                        style="width: 35px; height: auto;"
                                        v-html="icons.spotify"
                                    ></span>
                                </v-avatar>
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap justify-end>
                        <v-tooltip :open-delay="50" :close-delay="50" bottom>
                            <v-btn
                                slot="activator"
                                :fab="fab"
                                color="red darken-1"
                                class="animated zoomIn faster"
                                @click.stop="$emit('close-modal')"
                            >
                                <v-icon>arrow_back_ios</v-icon> VOLTAR
                            </v-btn>
                            <span>Cancelar edição das informações básicas</span>
                        </v-tooltip>
                        <v-tooltip :open-delay="50" :close-delay="50" bottom>
                            <v-btn
                                slot="activator"
                                :fab="fab"
                                :disabled="disabled"
                                color="success"
                                class="animated zoomIn faster"
                                @click.stop="saveInfos"
                            >
                                <v-icon>save</v-icon> SALVAR
                            </v-btn>
                            <span>Salvar as informações básicas</span>
                        </v-tooltip>
                    </v-layout>
                </v-container>
            </v-form>
        </template>
    </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import InLoading from '@/components/app/Loading'
import { setTimeout } from 'timers'
export default {
    components: {
        InLoading
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
        }
    },
    data() {
        return {
            loading: false,
            list: [],
            form: {
                website: { title: '', url: '', icon: '' },
                facebook: { url: '' },
                youtube: {
                    url: ''
                },
                instagram: { url: '' },
                twitter: { url: '' },
                spotify: {
                    url: ''
                }
            },
            isxs6: false,
            categories: []
        }
    },
    computed: {
        ...mapGetters({
            icons: 'app/getIcons',
            page: 'getPage'
        }),
        isAllVoid() {
            return Object.entries(this.form).every(entrie => {
                const [, value] = entrie
                return value.url === ''
            })
        },
        isAllValid() {
            return Object.entries(this.form)
                .filter(([, value]) => {
                    return value.url !== ''
                })
                .every(([, value]) => {
                    return this.isValidUrl(value.url)
                })
        },
        disabled() {
            return this.isAllVoid || !this.isAllValid
        }
    },
    watch: {
        dialog(val) {
            val || this.closeModal()
        },
        'form.website.url'(val) {
            this.getIcon(val)
        }
    },
    beforeMount() {
        this.form.website.title = this.page.title
        if (this.page.website)
            this.form.website = { url: this.page.website.url || '' }
        if (this.page.facebook)
            this.form.facebook = { url: this.page.facebook.url || '' }
        if (this.page.youtube)
            this.form.youtube = { url: this.page.youtube.url || '' }
        if (this.page.instagram)
            this.form.instagram = { url: this.page.instagram.url || '' }
        if (this.page.twitter)
            this.form.twitter = { url: this.page.twitter.url || '' }
        if (this.page.spotify)
            this.form.spotify = { url: this.page.spotify.url || '' }
        if (this.xs6) {
            const { breakpoint } = this.$vuetify
            this.isxs6 = breakpoint.width > 1200
        }
        if (this.page.categories) this.categories = this.page.categories
    },
    methods: {
        ...mapActions('page', ['setStateBox', 'setStateBasicInfo']),
        ...mapActions(['setPageInfoBasic']),
        async getIcon(url) {
            if (url && this.isValidUrl(url)) {
                try {
                    let icon = await this.$axios.$get(
                        `website/icon?url=${encodeURIComponent(url)}`
                    )
                    if (icon != 'favicon.ico') {
                        this.form.website.icon = icon
                        this.$forceUpdate()
                    }
                } catch (error) {
                    this.form.website.icon = ''
                    this.$forceUpdate()
                }
            }
        },
        closeModal() {
            this.setStateBasicInfo(false)
        },
        setDefaultImage() {
            this.form.website.icon = '/img/avatardefault.jpeg'
        },
        saveInfos() {
            const vm = this
            let isFail = false
            Object.entries(vm.form).map(([key, value]) => {
                if (value.url) {
                    if (value.url.includes('//m.')) {
                        this.form[key].url = value.url.replace('//m.', '//')
                    } else if (value.url.includes('//mobile.')) {
                        this.form[key].url = value.url.replace(
                            '//mobile.',
                            '//'
                        )
                    }
                    if (!vm.isValidUrl(value.url)) {
                        isFail = true
                        this.$toast({
                            message: `Link do ${vm.text[key]} inválido`,
                            color: 'warning',
                            icon: 'info'
                        })
                    }
                } else {
                    value.icon = ''
                    this.form[key] = value
                }
            })
            if (!isFail) {
                this.setPageInfoBasic(this.form)
                this.getInfosBasicPage()
            }
        },
        async getInfosBasicPage() {
            this.loading = true
            this.executeRoutines()
        },
        isValidLink(link) {
            return (
                link.includes('http://') ||
                link.includes('https://') ||
                link.includes('www.')
            )
        },
        isValidUrl(url) {
            const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
            const regex = new RegExp(expression)
            return regex.test(url) && this.isValidLink(url)
        },
        executeRoutines() {
            const vm = this
            Promise.all(
                Object.entries(this.form).map(entrie => {
                    const [key, value] = entrie
                    let fail = false
                    if (value.url) {
                        if (key === 'youtube')
                            return vm.getYoutubeChannel(value)
                        else if (key === 'twitter')
                            return vm.getTwitterPageInfo(value)
                        else if (key === 'instagram')
                            return vm.getInstagramPageInfo(value)
                        else if (
                            key != 'website' &&
                            key != 'facebook' &&
                            key != 'spotify'
                        )
                            fail = true
                    }
                    return new Promise(resolve =>
                        resolve({
                            key: key,
                            value: value,
                            fail: fail
                        })
                    )
                })
            ).then(list => {
                let infos = {}
                list.filter(l => !l.fail).map(({ key, value }) => {
                    infos[key] = value
                })
                setTimeout(() => {
                    vm.setPageInfoBasic(infos)
                    vm.$emit('change-step-next')
                    vm.$emit('infos', infos)
                    vm.list = list
                    vm.loading = false
                }, 500)
            })
        },
        getYoutubeChannel(value) {
            const vm = this
            return new Promise(resolve => {
                var channelId, type
                if (value.url.includes('user')) {
                    type = 'username'
                    channelId = value.url
                        .split('user')[1]
                        .split('/')
                        .join('')
                } else if (value.url.includes('channel')) {
                    type = 'id'
                    channelId = value.url
                        .split('channel')[1]
                        .split('/')
                        .join('')
                }
                if (channelId && type) {
                    vm.$axios
                        .$get(
                            `/youtube/channel/type?search=${channelId}&url=${
                                value.url
                            }&type=${type}`
                        )
                        .then(data => {
                            resolve({
                                key: 'youtube',
                                value: {
                                    ...value,
                                    ...data
                                }
                            })
                        })
                        .catch(() => {
                            resolve({
                                key: 'youtube',
                                value: value,
                                fail: true
                            })
                        })
                } else {
                    vm.$toast({
                        message: `Link do Youtube inválido`,
                        color: 'orange',
                        icon: 'info'
                    })
                    resolve({
                        key: 'youtube',
                        value: value,
                        fail: true
                    })
                }
            })
        },
        getTwitterPageInfo(value) {
            const vm = this
            return new Promise(resolve => {
                vm.$axios
                    .$get(`/twitter?url=${value.url}`)
                    .then(data => {
                        resolve({
                            key: 'twitter',
                            value: {
                                ...value,
                                ...data
                            }
                        })
                    })
                    .catch(() => {
                        resolve({
                            key: 'twitter',
                            value: value,
                            fail: true
                        })
                    })
            })
        },
        getInstagramPageInfo(value) {
            const vm = this
            return new Promise(resolve => {
                vm.$axios
                    .$get(`/instagram/info?link=${value.url}`)
                    .then(async data => {
                        resolve({
                            key: 'instagram',
                            value: {
                                ...value,
                                infos: data
                            }
                        })
                    })
                    .catch(() => {
                        resolve({
                            key: 'instagram',
                            value: value,
                            fail: true
                        })
                    })
            })
        }
    }
}
</script>

<style scoped>
.in-modal-avatar-align {
    margin-top: -3px;
}
</style>
