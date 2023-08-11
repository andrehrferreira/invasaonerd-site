<template>
  <section>
    <v-stepper v-model="e6" vertical>
      <InBasicInfoImages
        :avatar="instagram.infos.profile_pic_url"
        :show-cover="false"
        :e6="e6"
        @addType="addType"
        @next="next"
      />
      <v-stepper-step :complete="e6 > 2" step="2" editable>
        Resumo
        <small>Veja o resumo de suas configurações do Instagram</small>
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-list two-line subheader color="transparent">
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Avatar</v-list-tile-title>
              <v-list-tile-sub-title>{{ avatarText }}</v-list-tile-sub-title>
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
      required: false,
      default: () => {}
    },
    instagram: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      type: 'Instagram'
    }
  },
  methods: {
    async save() {
      await this.saveImages('Instagram', this.instagram.infos.profile_pic_url)
      let instagram = Object.assign({}, this.instagram)
      this.pageChange = {
        instagram
      }
      this.changes = {
        type: 'instagram',
        action: 'update'
      }
      this.saveStore()
      this.$toast({
        message: 'Configurações do Instagram realizadas com sucesso',
        color: 'success',
        icon: 'check-circle'
      })

      this.$emit('change-step-next')
    }
  }
}
</script>
