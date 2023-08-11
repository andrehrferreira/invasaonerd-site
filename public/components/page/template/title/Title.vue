<template>
  <section class="animated fadeIn">
    <v-layout v-if="editingType === 'title'">
      <EditorTitle
        :title="title"
        :nickname="nickname"
        :english-title="englishTitle"
      />
    </v-layout>
    <v-layout v-else row wrap>
      <v-flex v-show="editMode" xs12>
        <v-layout justify-end>
          <ButtonEdit
            bottom
            type="title"
            classes="mr-1"
            title="Editar Título"
          />
        </v-layout>
      </v-flex>
      <v-flex id="title" xs12>
        <h1 class="display-1 font-weight-regular">{{ title }}</h1>
        <h2 v-if="nickname" class="body-1" v-text="'(' + nickname + ')'"></h2>
        <h2
          v-if="englishTitle"
          class="body-1 font-italic"
          v-text="englishTitle"
        ></h2>
        <span v-if="officialPage" class="caption">
          <span>Usuário Verificado</span>
          <v-icon small class="py-1" color="green">verified_user</v-icon>
        </span>
      </v-flex>
    </v-layout>
  </section>
</template>

<script>
import EditorTitle from './EditorTitle'
import pageEdit from '@/mixins/pageEdit'
import ButtonEdit from '../../utils/ButtonEdit'
export default {
  components: {
    EditorTitle,
    ButtonEdit
  },
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
  }
}
</script>

<style scoped>
h1,
h2 {
  margin-bottom: 5px;
}
</style>
