<template>
  <v-container id="title">
    <v-layout>
      <v-layout justify-end>
        <v-tooltip :open-delay="50" :close-delay="50" bottom>
          <v-btn
            v-if="buttonState"
            slot="activator"
            color="success"
            dark
            icon
            @click.stop="checkChanges"
          >
            <v-icon>save</v-icon>
          </v-btn>
          <span>Salvar Título</span>
        </v-tooltip>
      </v-layout>
    </v-layout>
    <v-layout column>
      <v-text-field v-model="titleLocal" label="Título" dark></v-text-field>
      <v-text-field
        v-model="nicknameLocal"
        label="Subtítulo"
        dark
      ></v-text-field>
      <v-text-field
        v-model="englishTitleLocal"
        label="Título Original"
        dark
      ></v-text-field>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import pageEdit from '@/mixins/pageEdit'
export default {
  mixins: [pageEdit],
  props: {
    nickname: {
      type: String,
      required: false,
      default: () => ''
    },
    title: {
      type: String,
      required: true,
      default: () => ''
    },
    englishTitle: {
      type: String,
      required: false,
      default: () => ''
    },
    officialPage: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      nicknameLocal: this.nickname,
      titleLocal: this.title,
      englishTitleLocal: this.englishTitle,
      officialPageLocal: this.officialPage
    }
  },
  computed: {
    ...mapGetters({
      page: 'getPage'
    })
  },
  methods: {
    async checkChanges() {
      if (
        this.titleLocal === this.page.title &&
        this.nicknameLocal === this.page.nickname &&
        this.englishTitleLocal === this.page.englishTitle
      ) {
        this.setAdding(false)
        return this.setEditingType('')
      }
      if (
        (this.titleLocal.toLowerCase() === this.nicknameLocal.toLowerCase() &&
          this.nicknameLocal) ||
        (this.titleLocal.toLowerCase() ===
          this.englishTitleLocal.toLowerCase() &&
          this.englishTitleLocal) ||
        (this.nicknameLocal.toLowerCase() ===
          this.englishTitleLocal.toLowerCase() &&
          (this.nicknameLocal || this.englishTitleLocal))
      ) {
        return this.$toast({
          message:
            'O título não pode ser igual ao subtítulo ou título original',
          color: 'orange',
          icon: 'warning'
        })
      }
      let query = {}
      if (this.titleLocal && this.titleLocal !== this.page.title)
        query.title = this.titleLocal
      if (this.nicknameLocal && this.nicknameLocal !== this.page.nickname)
        query.nickname = this.nicknameLocal
      if (
        this.englishTitleLocal &&
        this.englishTitleLocal !== this.page.englishTitle
      )
        query.englishTitle = this.englishTitleLocal

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
      this.changes = {
        type: this.editingType,
        action: 'update'
      }
      this.pageChange = {
        title: this.titleLocal,
        nickname: this.nicknameLocal,
        englishTitle: this.englishTitleLocal
      }
      this.saveStore()
      this.$toast({
        message: `Edições de título e subtítulo gravadas para envio`,
        color: 'success',
        icon: 'check-circle'
      })
    }
  }
}
</script>

<style></style>
