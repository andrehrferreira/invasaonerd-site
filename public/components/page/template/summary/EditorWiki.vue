<template>
    <PageEditorContainer
        type="wiki"
        title="Resumo"
        class="in-summary"
        @save="save"
    >
        <InPageSearch
            title="Resumo"
            :loading="loading"
            :empty="empty"
            :search="search"
            @search="getWiki"
        >
            <template v-if="error">
                <v-alert
                    v-model="error"
                    color="warning"
                    icon="warning"
                    dismissible
                >
                    <span>
                        Não encontramos nada referente a
                        <strong>{{ search }}</strong>
                        , verifique se o termo digitado está correto ou edite
                        manualmente, caso o termo esteja correto, verifique se a
                        página que você está procurando existe em Portuguẽs, a
                        busca encontra apenas páginas em português
                    </span>
                </v-alert>
            </template>
            <template v-else>
                <v-layout v-if="manualEdit" row>
                    <section class="quill-editor-container">
                        <div
                            v-quill:myQuillEditor="options"
                            class="quill-editor"
                            :content="summary"
                            @change="onEditorChange($event)"
                        ></div>
                    </section>
                </v-layout>
                <v-layout v-else class="in-summary" row wrap>
                    <v-flex xs12>
                        <span v-html="summary"></span>
                    </v-flex>
                </v-layout>
                <v-layout justify-end>
                    <v-btn
                        color="success"
                        @click.stop="manualEdit = !manualEdit"
                    >
                        <v-icon>edit</v-icon>
                        Editar Wiki
                        {{ manualEdit ? 'Automaticamente' : 'Manualmente' }}
                    </v-btn>
                </v-layout>
                <v-layout column mt-3>
                    <v-flex>
                        <v-layout justify-start>
                            <h5>Informações</h5>
                        </v-layout>
                        <hr />
                    </v-flex>
                    <v-flex>
                        <v-layout wrap column>
                            <v-flex
                                v-for="([key, value, checked],
                                index) in fullinfo"
                                :key="index"
                            >
                                <v-layout
                                    v-show="editingItem === index"
                                    wrap
                                    column
                                >
                                    <v-card>
                                        <v-card-text>
                                            <v-text-field
                                                v-model="key"
                                                type="text"
                                                @keyup.enter="
                                                    saveInfo(
                                                        [key, value, checked],
                                                        index
                                                    )
                                                "
                                            ></v-text-field>
                                            <v-text-field
                                                v-model="value"
                                                type="text"
                                                @keyup.enter="
                                                    saveInfo(
                                                        [key, value, checked],
                                                        index
                                                    )
                                                "
                                            ></v-text-field>
                                            <v-layout row wrap>
                                                <v-tooltip
                                                    :open-delay="50"
                                                    :close-delay="50"
                                                    bottom
                                                >
                                                    <v-btn
                                                        slot="activator"
                                                        icon
                                                        color="success"
                                                        @click.stop="
                                                            saveInfo(
                                                                [
                                                                    key,
                                                                    value,
                                                                    checked
                                                                ],
                                                                index
                                                            )
                                                        "
                                                    >
                                                        <v-icon small
                                                            >save</v-icon
                                                        >
                                                    </v-btn>
                                                    <span>Salvar</span>
                                                </v-tooltip>
                                                <v-tooltip
                                                    :open-delay="50"
                                                    :close-delay="50"
                                                    bottom
                                                >
                                                    <v-btn
                                                        slot="activator"
                                                        icon
                                                        color="red"
                                                        @click.stop="
                                                            editingItem = -1
                                                        "
                                                    >
                                                        <v-icon small
                                                            >close</v-icon
                                                        >
                                                    </v-btn>
                                                    <span>Cancelar</span>
                                                </v-tooltip>
                                            </v-layout>
                                        </v-card-text>
                                    </v-card>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex shrink align-end pt-2>
                                        <v-tooltip
                                            :open-delay="50"
                                            :close-delay="50"
                                            bottom
                                        >
                                            <v-btn
                                                v-show="editingItem == -1"
                                                slot="activator"
                                                icon
                                                color="success"
                                                @click.stop="
                                                    editingItem = index
                                                "
                                            >
                                                <v-icon small>edit</v-icon>
                                            </v-btn>
                                            <span>Editar</span>
                                        </v-tooltip>
                                        <v-tooltip
                                            :open-delay="50"
                                            :close-delay="50"
                                            bottom
                                        >
                                            <v-btn
                                                v-show="editingItem == -1"
                                                slot="activator"
                                                icon
                                                color="red"
                                                @click.stop="deleteItem(index)"
                                            >
                                                <v-icon small>delete</v-icon>
                                            </v-btn>
                                            <span>Deletar</span>
                                        </v-tooltip>
                                    </v-flex>
                                    <v-flex>
                                        <v-layout justify-start align-center>
                                            <v-checkbox
                                                v-show="editingItem == -1"
                                                :input-value="checked"
                                                color="success"
                                                @click.stop="changeItem(index)"
                                            >
                                                <template v-slot:label>
                                                    <strong>{{ key }}: </strong>
                                                    <span
                                                        v-if="
                                                            typeof value ===
                                                                'object'
                                                        "
                                                    >
                                                        {{ value.join(', ') }}
                                                    </span>
                                                    <span v-else>{{
                                                        value
                                                    }}</span>
                                                </template>
                                            </v-checkbox>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
                <v-layout justify-end>
                    <v-btn
                        v-show="!addInfo"
                        color="secondary"
                        @click.stop="addInfo = !addInfo"
                    >
                        <v-icon>add</v-icon>Adicionar uma nova informação
                    </v-btn>
                </v-layout>
                <v-layout v-show="addInfo">
                    <v-flex>
                        <v-card>
                            <v-card-text>
                                <v-text-field
                                    v-model="newInfo[0]"
                                    type="text"
                                    placeholder="Titulo"
                                ></v-text-field>
                                <v-text-field
                                    v-model="newInfo[1]"
                                    type="text"
                                ></v-text-field>
                                <v-layout row wrap>
                                    <v-tooltip
                                        :open-delay="50"
                                        :close-delay="50"
                                        bottom
                                    >
                                        <v-btn
                                            slot="activator"
                                            icon
                                            color="success"
                                            @click.stop="pushInfo(newInfo)"
                                        >
                                            <v-icon small>save</v-icon>
                                        </v-btn>
                                        <span>Salvar</span>
                                    </v-tooltip>
                                    <v-tooltip
                                        :open-delay="50"
                                        :close-delay="50"
                                        bottom
                                    >
                                        <v-btn
                                            slot="activator"
                                            icon
                                            color="red"
                                            @click.stop="addInfo = !addInfo"
                                        >
                                            <v-icon small>close</v-icon>
                                        </v-btn>
                                        <span>Cancelar</span>
                                    </v-tooltip>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </template>
        </InPageSearch>
    </PageEditorContainer>
</template>

<script>
import { mapGetters } from 'vuex'
import PageEditorContainer from '@/components/page/utils/PageEditorContainer'
import InPageSearch from '@/components/page/utils/PageSearch'
import pageEdit from '@/mixins/pageEdit'

export default {
    components: {
        PageEditorContainer,
        InPageSearch
    },
    mixins: [pageEdit],
    props: {
        wiki: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    data() {
        return {
            loading: false,
            error: false,
            search: '',
            empty: false,
            summary: this.wiki.summary || '',
            editorOption: {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block']
                    ]
                }
            },
            manualEdit: false,
            newInfo: ['', '', true, ''],
            selecteds: [],
            fullinfo: Object.assign([], this.wiki.fullinfo || []),
            editingItem: -1,
            addInfo: false,
            force: true
        }
    },
    computed: {
        ...mapGetters({
            page: 'getPage'
        }),
        options() {
            return {
                theme: 'snow',
                placeholder: 'Descreva a página ' + this.page.title,
                modules: {
                    toolbar: [['bold', 'italic', 'underline', 'strike']]
                }
            }
        }
    },
    watch: {
        page(val) {
            if (val && val.title) this.search = val.title
        }
    },
    beforeMount() {
        this.search = this.page.title
    },
    methods: {
        save() {
            const { summary, fullinfo } = this
            this.changes = {
                type: 'wiki',
                action: 'update'
            }
            this.pageChange = {
                wiki: {
                    summary,
                    fullinfo: fullinfo.filter(entrie => {
                        const [, , checked] = entrie
                        return checked
                    })
                }
            }
            this.saveStore()
            this.$toast({
                message: `Edições dos canais relacionados gravado para envio`,
                color: 'success',
                icon: 'check-circle'
            })
        },
        async getWiki(search) {
            if (
                search &&
                (this.force ||
                    this.search.toLowerCase() != search.toLowerCase())
            ) {
                this.force = false
                this.search = search
                this.empty = false
                this.error = false
                this.loading = true
                try {
                    const { summary, fullinfo } = await this.$axios.$get(
                        `wiki?search=${encodeURIComponent(search)}`
                    )
                    this.summary = summary
                    this.fullinfo = Object.entries(fullinfo)
                        .map(entrie => {
                            var [key, value, checked, link] = entrie
                            if (typeof value == 'string') {
                                if (value.split(', ').length > 1) {
                                    value = value.split(', ')
                                }
                            }
                            if (typeof value == 'object') link = ''
                            else link = ''
                            checked = false
                            key = this.formatKey(key)
                            return [key, value, checked, link]
                        })
                        .filter(item => {
                            const [, value] = item
                            if (typeof value == 'object') {
                                return Array.isArray(value)
                            }
                            return true
                        })
                    this.loading = false
                    if (this.summary == '') this.error = true
                } catch (error) {
                    this.loading = false
                    this.error = true
                }
            } else if (search == '') {
                this.empty = true
            }
        },
        changeItem(index) {
            this.fullinfo = this.fullinfo.map((entrie, idx) => {
                if (idx === index) entrie[2] = !entrie[2]
                return entrie
            })
        },

        deleteItem(index) {
            this.fullinfo = this.fullinfo.filter((entrie, idx) => {
                return index !== idx
            })
        },

        saveInfo(info, index) {
            this.fullinfo = this.fullinfo.map((entrie, idx) => {
                if (idx === index) {
                    if (
                        typeof info[1] == 'string' &&
                        info[1].indexOf(',') > -1
                    ) {
                        entrie[1] = info[1].split(',')
                    } else {
                        entrie = info
                    }
                }
                return entrie
            })
            this.editingItem = -1
        },

        selectInfo(check, key) {
            if (check) {
                this.selecteds.push(key)
            } else if (this.selecteds.includes(key)) {
                this.selecteds = this.selecteds.filter(selected => {
                    return selected !== key
                })
            }
        },

        pushInfo(info) {
            if (info[1].split(', ').length > 1) {
                info[3] = []
                info[1] = info[1].split(', ').map(item => {
                    info[3].push('')
                    return item
                })
            }
            this.fullinfo.push(info)
            this.newInfo = ['', '', true, '']
            this.addInfo = false
        },

        formatKey(key) {
            const letters = this.setSpaces(key.split(''))
            var ret =
                letters[0].toUpperCase() +
                letters.slice(1, letters.length).join('')
            return ret
        },

        setSpaces(letters) {
            return letters.map(letter => {
                if (letter === letter.toUpperCase()) {
                    return ' ' + letter
                }
                return letter
            })
        },
        onEditorChange({ html }) {
            this.summary = html
        }
    }
}
</script>

<style lang="scss">
.in-page-fullinfo {
    margin: none;
    list-style: none;
    padding: 0px;
}
.quill-editor-container {
    width: 100%;
    margin: 0 auto;
    padding: 50px 0;
    .quill-editor {
        background-color: white;
        color: black;
        min-height: 200px;
        max-height: 400px;
        overflow-y: auto;
    }
    .ql-toolbar {
        background-color: white !important;
    }
}
</style>
