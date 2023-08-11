<template>
    <v-container align-content-start align-start justify-start>
        <v-card class="mx-auto" max-width="100%">
            <v-card-title class="title font-weight-regular justify-center">
                <span>{{ currentTitle }}</span>
            </v-card-title>

            <v-window v-model="step">
                <v-window-item :value="1">
                    <v-card-text>
                        <InCreatePage
                            :categories="categories"
                            :page="pageInfo"
                            @getInfosPages="getInfosPages"
                            @setValidStep="setValidStep"
                        />
                    </v-card-text>
                </v-window-item>

                <v-window-item :value="2">
                    <InBasicInfoStepper
                        xs6
                        @next="fowardStep"
                        @close-modal="backwardStep"
                    />
                </v-window-item>

                <v-window-item :value="3">
                    <v-layout row wrap justify-center>
                        <v-layout v-if="loading">
                            <InLoading text="Enviando para aprovação" />
                        </v-layout>
                        <v-layout v-else-if="isAdmin" row wrap>
                            <v-flex xs12 md6 offset-md3 lg4 offset-lg4>
                                <p
                                    class="text-xs-center"
                                    v-html="icons.page"
                                ></p>
                            </v-flex>
                        </v-layout>
                        <v-flex v-else xs12 sm10 md8 lg6 xl4>
                            <p class="text-xs-center">
                                Já temos informações o suficiente para enviar
                                sua sugestão para um aprovador avaliar porém,
                                você tem a opção de continuar editando e
                                acrescentar mais informações a sua sugestão.
                            </p>
                            <v-layout row wrap justify-center>
                                <!-- <v-btn color="success" @click.stop="continueEditing"
                  >CONTINUAR EDITANDO</v-btn
                > -->
                                <!-- <v-spacer></v-spacer> -->
                                <v-btn
                                    :loading="loading"
                                    color="success"
                                    @click.prevent.stop="
                                        sendEdition(false, true)
                                    "
                                    >ENVIAR PARA APROVAÇÃO</v-btn
                                >
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-window-item>
            </v-window>

            <v-divider></v-divider>

            <v-card-actions>
                <v-btn
                    v-if="step == 2"
                    :disabled="!validStep"
                    flat
                    color="#ef001c"
                    @click="backwardStep"
                >
                    <v-icon>keyboard_arrow_left</v-icon>VOLTAR
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    v-if="step !== 3"
                    :disabled="!validStep || loading"
                    :loading="loading"
                    flat
                    color="success"
                    @click="fowardStep"
                >
                    AVANÇAR
                    <v-icon>keyboard_arrow_right</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import InCreatePage from '@/components/page/template/createPage/CreatePage'
import InBasicInfoStepper from '@/components/page/template/basicInfo/BasicInfoStepper'
import InLoading from '@/components/app/Loading'
import pageEdit from '@/mixins/pageEdit'
import { setTimeout } from 'timers'
import { mapGetters } from 'vuex'
export default {
    middleware: 'auth',
    components: {
        InCreatePage,
        InBasicInfoStepper,
        InLoading
    },
    mixins: [pageEdit],
    data() {
        return {
            step: 1,
            validStep: false,
            pageInfo: {},
            title: '',
            nickname: '',
            englishTitle: ''
        }
    },
    computed: {
        ...mapGetters('auth', ['isAdmin']),
        ...mapGetters({
            icons: 'app/getIcons'
        }),
        currentTitle() {
            switch (this.step) {
                case 1:
                    return this.hasTitle
                        ? `Não encontrado nada Referente a ${this.title}, vamos criar esta página? :)`
                        : `Bem vindo ao ${
                              this.isAdmin ? 'criador' : 'sugestor'
                          } de páginas`
                case 2:
                    return 'Coleta de Informações'
                default:
                    return this.isAdmin
                        ? 'Página criada com sucesso!'
                        : 'Estamos quase lá...'
            }
        },
        hasTitle() {
            return false
        }
    },
    async asyncData({ app: { $axios }, error }) {
        try {
            let categories = await $axios.$get(`/categories`)
            return {
                categories
            }
        } catch (e) {
            error({ statusCode: 404, message: 'Página não encontrada' })
        }
    },

    beforeMount() {
        if (this.$route.query.title) {
            this.pageInfo.title = this.$route.query.title
        }
        const { commit } = this.$store
        commit('SET_PAGE', {})
    },
    methods: {
        async check() {
            if (
                (this.title.toLowerCase() === this.nickname.toLowerCase() &&
                    this.nickname) ||
                (this.title.toLowerCase() === this.englishTitle.toLowerCase() &&
                    this.englishTitle) ||
                (this.nickname.toLowerCase() ===
                    this.englishTitle.toLowerCase() &&
                    (this.nickname || this.englishTitle))
            ) {
                return this.$toast({
                    message:
                        'O título não pode ser igual ao subtítulo ou título original',
                    color: 'orange',
                    icon: 'warning'
                })
            }
            let query = {}
            if (this.title) query.title = this.title
            if (this.nickname) query.nickname = this.nickname
            if (this.englishTitle) query.englishTitle = this.englishTitle

            const { title, nickname, englishTitle } = await this.$axios.$post(
                '/page/check',
                query
            )
            let message = []
            if (title) message.push('título')
            if (nickname) message.push('subtítulo')
            if (englishTitle) message.push('título original')
            if (message.length) {
                this.$toast({
                    message: `Este ${message.join(', ')} já existe`,
                    color: 'orange',
                    icon: 'warning'
                })
            } else {
                this.save()
            }
        },
        save() {
            const { title, nickname, englishTitle, categories } = this
            this.pageChange = {
                title,
                nickname,
                englishTitle,
                categories,
                local: true,
                ref: new Date().getTime(),
                url: title
                    .toLowerCase()
                    .split(' ')
                    .join('-')
                    .split('')
                    .filter(
                        e => e !== '?' && e !== '#' && e !== '&' && e !== '$'
                    )
                    .join('')
            }
            this.changes = [
                {
                    type: 'title',
                    action: 'create'
                },
                {
                    type: 'categories',
                    action: 'create'
                }
            ]
            this.saveStore()
            this.setStep(this.step + 1)
            this.setValidStep(false)
        },
        fowardStep() {
            if (this.step === 1) {
                this.check()
            } else {
                this.setStep(this.step + 1)
                this.setValidStep(false)
            }
        },
        backwardStep() {
            this.setStep(this.step - 1)
            this.setValidStep(true)
        },
        async setStep(step) {
            this.step = step
            if (step === 3) {
                if (this.isAdmin) {
                    const feedback = await this.sendEdition()
                    setTimeout(() => {
                        if (feedback && feedback._id)
                            this.$router.push(`/admin/feedback/${feedback._id}`)
                    }, 1000)
                }
            }
        },
        setValidStep(val) {
            this.validStep = val
        },
        getInfosPages(val) {
            const { title, nickname, englishTitle, categories } = val
            this.title = title
            this.nickname = nickname
            this.englishTitle = englishTitle
            this.categories = categories
        }
    }
}
</script>

<style></style>
