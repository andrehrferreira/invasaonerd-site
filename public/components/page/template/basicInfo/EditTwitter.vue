<template>
  <section>
    <v-stepper v-model="e6" vertical>
      <InBasicInfoImages
        :cover="twitter.cover"
        :avatar="twitter.avatar"
        :e6="e6"
        @addType="addType"
        @next="next"
      />
      <v-stepper-step :complete="e6 > 3" step="3" editable>
        Widget do Twitter
        <small>Deseja exibir o widget do Twitter na página?</small>
        <small>
          Atualmente o widget do Twitter está
          {{ config.embbed ? 'ativado' : 'desativado' }}
        </small>
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-layout row column>
          <v-img
            max-height="80px"
            contain
            src="/img/twitter-widget-example.png"
          ></v-img>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-layout justify-end align-center>
            <v-btn flat @click="addType({ type: 'embbed', value: false })"
              >Não</v-btn
            >
            <v-btn
              color="primary"
              @click="addType({ type: 'embbed', value: true })"
              >Sim</v-btn
            >
          </v-layout>
        </v-layout>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 4" step="4" editable>
        Resumo
        <small>Veja o resumo de suas configurações do Twitter</small>
      </v-stepper-step>

      <v-stepper-content step="4">
        <v-list two-line subheader color="transparent">
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Avatar</v-list-tile-title>
              <v-list-tile-sub-title>{{ avatarText }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Capa</v-list-tile-title>
              <v-list-tile-sub-title>{{ coverText }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title> Widget do Twitter</v-list-tile-title>
              <v-list-tile-sub-title>
                {{
                  configs.embbed
                    ? 'O widget do Twitter foi ativado'
                    : 'Não foi ativado o widget do Twitter'
                }}</v-list-tile-sub-title
              >
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-layout row wrap justify-end align-center>
          <v-btn color="primary" @click="save">Salvar configurações</v-btn>
        </v-layout>
      </v-stepper-content>
    </v-stepper>
  </section>
</template>

<script>
import basicInfosMixins from './basicInfosMixins'
export default {
  mixins: [basicInfosMixins],
  props: {
    config: {
      type: Object,
      required: true,
      default: () => {}
    },
    twitter: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      type: 'Twitter'
    }
  },
  beforeMount() {
    this.configs.embbed = this.twitter.embbed
  },
  methods: {
    async save() {
      await this.saveImages('Twitter', this.twitter.avatar, this.twitter.cover)
      let twitter = Object.assign({}, this.twitter)
      twitter.embbed = this.configs.embbed
      this.pageChange = {
        twitter
      }
      this.changes = {
        type: 'twitter',
        action: 'update'
      }
      this.saveStore()
      this.$toast({
        message: 'Configurações do Twitter realizadas com sucesso',
        color: 'success',
        icon: 'check-circle'
      })

      this.$emit('change-step-next')
    }
  }
}
</script>
