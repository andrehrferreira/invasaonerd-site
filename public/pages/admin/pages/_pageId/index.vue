<template>
    <v-container align-content-start align-start justify-start>
        <v-card class="mx-auto" max-width="100%">
            <v-list three-line subheader>
                <v-subheader>SEO</v-subheader>
                <v-spacer></v-spacer>
            </v-list>
            <v-container grid-list-md>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field
                                v-model="seo.title"
                                label="Título"
                                required
                                :counter="65"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-textarea
                                v-model="seo.description"
                                label="Descrição"
                                :counter="150"
                                required
                                hint="A descrição é importante"
                                validate-on-blur
                                :rules="[
                                    v =>
                                        v.length >= 10 ||
                                        'Precisa ter pelo menos 10 caracteres'
                                ]"
                            ></v-textarea>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                v-model="keyword"
                                label="Palavra chave"
                                @keyup.enter="addKeyword"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <template v-for="key in listKeywords">
                            <v-chip
                                :key="key"
                                selected
                                close
                                class="chip--select-multi"
                                @input="removeKeyword(key)"
                                >{{ key }}</v-chip
                            >
                        </template>
                    </v-layout>
                </v-form>
            </v-container>
            <v-divider></v-divider>
            <v-list three-line subheader>
                <v-subheader>Configurações</v-subheader>
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-checkbox v-model="engagement"></v-checkbox>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Engajamento</v-list-tile-title>
                        <v-list-tile-sub-title>
                            Mostrar essa página na tela inicial quando o usuário
                            estiver criando a conta
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
            <v-card-actions>
                <v-layout justify-end>
                    <v-btn flat @click.stop="back">Voltar</v-btn>
                    <v-btn :href="`/page/${url}`" color="info" target="_blank"
                        >Abrir Página</v-btn
                    >
                    <v-btn color="primary" @click.stop="saveSEO">Salvar</v-btn>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
export default {
    middleware: ['superadmin'],
    data() {
        return {
            valid: true,
            keyword: ''
        }
    },
    computed: {
        listKeywords() {
            const { keywords } = this.seo
            return keywords.filter(function(item, pos) {
                return keywords.indexOf(item) == pos
            })
        }
    },
    watch: {
        engagement(val) {
            this.setEngagement(val)
        }
    },
    async asyncData({ app: { $axios }, params: { pageId }, error }) {
        try {
            // let actual = {}
            let { data } = await $axios.$get(`/manage-pages/${pageId}`)
            let need = false
            if (!data.seo) {
                const keys = data.metatags.keywords.split(', ')
                let keywords = [...data.categories, 'Invasão Nerd', ...keys]
                data.seo = {
                    title:
                        data.title +
                        (data.subtitle ? ` (${data.subtitle})` : ''),
                    description: data.metatags.description,
                    keywords
                }
                need = true
            }
            return {
                pageId: pageId,
                seo: data.seo,
                need,
                url: data.url,
                engagement: data.engagement || false
            }
        } catch (e) {
            error({ statusCode: 404, message: 'Página não encontrada' })
        }
    },
    beforeMount() {
        this.$nextTick(() => {
            this.showMessage()
        })
    },
    methods: {
        addKeyword() {
            if (
                this.seo.keywords.every(
                    key =>
                        key.trim().toLowerCase() !=
                        this.keyword.trim().toLowerCase()
                )
            )
                this.seo.keywords.push(this.keyword)
            this.keyword = ''
        },
        removeKeyword(keyword) {
            this.seo.keywords = this.seo.keywords.filter(
                key => key.trim().toLowerCase() != keyword.trim().toLowerCase()
            )
        },
        async setEngagement(engagement) {
            try {
                await this.$axios.$post(
                    `/manage-pages/${this.pageId}/engagement`,
                    {
                        engagement
                    }
                )
                this.$toast({
                    message: `Página ${
                        engagement ? 'marcada para' : 'removida do'
                    } engajamento`,
                    color: 'success',
                    icon: 'check-circle'
                })
            } catch (error) {
                this.$toast({
                    message: 'Falha na comunicação com o servidor',
                    color: 'red',
                    icon: 'warning'
                })
            }
        },
        async saveSEO() {
            try {
                const { seo } = this
                if (this.$refs.form.validate() && seo.keywords.length > 0) {
                    await this.$axios.$post(
                        `/manage-pages/${this.pageId}/seo`,
                        {
                            seo: {
                                ...seo,
                                keywords: this.listKeywords
                            }
                        }
                    )
                    this.$toast({
                        message: `Informações de SEO gravadas com sucesso`,
                        color: 'success',
                        icon: 'check-circle'
                    })
                } else if (seo.keywords.length === 0) {
                    this.$toast({
                        message: 'Adicione uma palavra chave',
                        color: 'warning',
                        icon: 'warning'
                    })
                }
            } catch (error) {
                this.$toast({
                    message: 'Falha na comunicação com o servidor',
                    color: 'red',
                    icon: 'warning'
                })
            }
        },
        showMessage() {
            if (this.need)
                this.$toast({
                    message: 'As informações de SEO ainda não foram informadas',
                    color: 'info',
                    icon: 'warning'
                })
        },
        back() {
            this.$router.back()
        }
    }
}
</script>
