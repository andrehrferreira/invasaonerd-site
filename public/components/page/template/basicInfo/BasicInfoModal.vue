<template>
    <v-dialog
        v-model="dialog"
        hide-overlay
        transition="dialog-bottom-transition"
        max-width="600px"
        persistent
    >
        <v-card>
            <v-toolbar dark color="primary">
                <v-spacer></v-spacer>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <InBasicInfoStepper
                :page-item="page"
                @close-modal="dialog = false"
                @next="dialog = false"
            />
            <!-- <template v-if="loading">
        <InLoading :svg="icons.pacman" text="Salvando as informações" />
      </template>
      <template v-else>
        <template v-if="step == 'basic-info'">
          <InBasicInfo
            @close-modal="dialog = false"
            @change-step-next="changeStepNext"
            @infos="getInfos"
          />
        </template>
        <template v-else-if="step == 'youtube'">
          <InEditYoutube
            :config="configYoutube"
            :youtube="infos.youtube"
            @change-step-next="changeStepNext"
          />
        </template>
        <template v-else-if="step == 'twitter'">
          <InEditTwitter
            :config="configTwitter"
            :twitter="infos.twitter"
            @change-step-next="changeStepNext"
          />
        </template>
        <template v-else-if="step == 'instagram'">
          <InEditInstagram
            :config="configInstagram"
            :instagram="infos.instagram"
            @change-step-next="changeStepNext"
          />
        </template>
      </template> -->
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import InBasicInfoStepper from './BasicInfoStepper'
export default {
    components: {
        InBasicInfoStepper
    },
    data() {
        return {
            dialog: true,
            step: 'basic-info',
            infos: {
                youtube: {}
            },
            loading: false
        }
    },
    computed: {
        ...mapGetters({ page: 'getPage' }),
        ...mapGetters({
            icons: 'app/getIcons'
        }),
        steps() {
            //  steps: ['basic-info', 'instagram', 'youtube', 'twitter'],
            let steps = ['basic-info']
            if (this.configInstagram) steps.push('instagram')
            if (this.configYoutube) steps.push('youtube')
            if (this.configTwitter) steps.push('twitter')
            return steps
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
        },
        title() {
            switch (this.step) {
                case 'instagram':
                    return 'Configuração do Instagram'
                case 'youtube':
                    return 'Configuração do Youtube'
                case 'twitter':
                    return 'Configuração do Twitter'
                default:
                    return 'Informações Básicas'
            }
        }
    },
    watch: {
        dialog(val) {
            val || this.closeModal()
        }
    },
    methods: {
        ...mapActions('page', ['setStateBasicInfo']),
        closeModal() {
            this.setStateBasicInfo(false)
        },
        changeStepNext() {
            this.loading = true
            setTimeout(() => {
                const index = this.steps.indexOf(this.step)
                if (this.steps.length > index + 1)
                    this.step = this.steps[index + 1]
                else this.closeModal()
                this.loading = false
            }, 1000)
        },
        getInfos(infos) {
            this.infos = infos
        }
    }
}
</script>
