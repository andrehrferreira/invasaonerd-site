<template>
    <InModal
        title="Report de Bug"
        type="BugReport"
        justify-space-between
        :show-cancel="false"
    >
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-layout row wrap>
                <v-flex class="hidden-sm-and-down">
                    <p class="grey--text">
                        DICA: Quando identificar um bug aperte F12, caso tenha
                        alguma mensagem na cor vermelha, mande um print das
                        mensagens para nós
                    </p>
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                        v-model="bug.title"
                        label="Assunto*"
                        :rules="[
                            v => v.length <= 100 || 'Maximo de 100 caracteres'
                        ]"
                        :counter="100"
                        hint="Minimo de 3 caracteres"
                        autofocus
                        color="white"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-textarea
                        v-model="bug.details"
                        label="Detalhes*"
                        :rules="[
                            v => v.length <= 1000 || 'Maximo de 1000 caracteres'
                        ]"
                        :counter="1000"
                        hint="Minimo de 10 caracteres"
                        color="white"
                    ></v-textarea>
                </v-flex>
                <v-flex v-if="bug.screenshots.length" xs12>
                    <v-layout
                        row
                        wrap
                        justify-space-around
                        class="animated zoomIn faster"
                    >
                        <v-flex
                            v-for="(image, index) in bug.screenshots"
                            :key="index"
                            class="pa-1"
                        >
                            <v-layout justify-center>
                                <v-hover>
                                    <v-img
                                        slot-scope="{ hover }"
                                        width="120px"
                                        height="120px"
                                        contain
                                        :src="image"
                                        class="ma-0 grey darken-4"
                                    >
                                        <v-container
                                            v-show="hover"
                                            fill-height
                                            fluid
                                            class="animated fadeIn faster"
                                            style="background-color: rgba(0,0,0, 0.7); cursor: pointer;"
                                            @click.stop="
                                                removeScreenshot(index)
                                            "
                                        >
                                            <v-layout
                                                justify-center
                                                align-center
                                                fill-height
                                            >
                                                <v-icon large>close</v-icon>
                                            </v-layout>
                                        </v-container>
                                    </v-img>
                                </v-hover>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout justify-end>
                        <p class="mb-0">
                            {{ bug.screenshots.length }} de 5 imagens
                        </p>
                    </v-layout>
                </v-flex>
                <v-flex xs12></v-flex>
            </v-layout>
        </v-form>
        <template v-slot:save>
            <InUploadBtn
                title="screenshots"
                :color="bug.screenshots.length > 4 ? 'grey' : 'success'"
                :disabled="bug.screenshots.length > 4"
                :file-changed-callback="fileChanged"
                multiple
                class="px-0 mx-0"
            >
                <template slot="icon-left">
                    <v-icon class="mr-2">cloud_upload</v-icon>
                </template>
            </InUploadBtn>
            <v-btn
                color="#ef001c"
                :loading="loading"
                :disabled="validateBug"
                @click.stop="reportBug(bug)"
                >REPORTAR</v-btn
            >
        </template>
    </InModal>
</template>

<script>
import InModal from '@/components/template/Modal'
import InUploadBtn from '@/components/template/UploadBtn'

import { mapActions } from 'vuex'

export default {
    components: {
        InModal,
        InUploadBtn
    },
    data() {
        return {
            valid: true,
            report: {
                categorie: '',
                text: ''
            },
            loading: false,
            bug: {
                title: '',
                details: '',
                screenshots: [],
                solved: false,
                user: '',
                timestamp: undefined,
                feedback: {
                    admUser: '',
                    text: '',
                    screenshots: [],
                    timestamp: undefined
                }
            },
            defaultBug: {
                title: '',
                details: '',
                screenshots: [],
                solved: false,
                user: '',
                timestamp: undefined,
                feedback: {
                    admUser: '',
                    text: '',
                    screenshots: [],
                    timestamp: undefined
                }
            }
        }
    },
    computed: {
        validateBug() {
            const { title, details } = this.bug
            return (
                title.length > 100 ||
                details.length > 1000 ||
                title.length < 3 ||
                details.length < 10
            )
        }
    },
    methods: {
        ...mapActions('app', ['setModal']),
        removeScreenshot(index) {
            this.bug.screenshots = this.bug.screenshots.filter((img, idx) => {
                return idx !== index
            })
        },
        async reportBug(bug) {
            const vue = this
            vue.loading = true
            try {
                await this.$axios.$post('/bugs', {
                    bug
                })
                vue.$toast({
                    message:
                        'Bug reportado com sucesso, nossa equipe irá verificar e te enviar um feedback assim que possível, obrigado :)',
                    color: 'green',
                    icon: 'info',
                    timeout: 8000
                })
                vue.bug = vue.defaultBug
                this.setModal('BugReport')
            } catch (err) {
                vue.$toast({
                    message: 'Ocorreu um erro na comunicação com o servidor',
                    color: 'red',
                    icon: 'warning'
                })
            }
            vue.loading = false
        },

        async fileChanged(files) {
            const vue = this
            const imgs = await Promise.all(
                Array.from(files)
                    .filter((file, index) => {
                        return (
                            (file.type === 'image/png' ||
                                file.type === 'image/jpeg') &&
                            index < 5 - vue.bug.screenshots.length
                        )
                    })
                    .map(async file => {
                        const reader = new FileReader()
                        reader.readAsDataURL(file.slice())
                        return new Promise(res => {
                            reader.onloadend = function() {
                                res(reader.result)
                            }
                        })
                    })
            )
            imgs.forEach(img => {
                if (!vue.bug.screenshots.includes(img)) {
                    vue.bug.screenshots.push(img)
                }
            })
        }
    }
}
</script>

<style></style>
