<template>
  <v-container fluid grid-list-xl>
    <v-layout align-center row wrap>
      <v-flex xs12 class="pb-0">
        Para começar-mos por favor informe o Título e a/as categoria(as) da
        página que você está criando e clique em avançar
      </v-flex>

      <v-flex xs12>
        <v-text-field
          v-model="pagesInfos.title"
          label="Título *"
          hint="Obrigatório"
          color="white"
          validate-on-blur
          @input="checkSelectes"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 md6>
        <v-text-field
          v-model="pagesInfos.nickname"
          label="Subtítulo"
          hint="Não Obrigaório"
          color="white"
          clearable
          @input="checkSelectes"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 md6>
        <v-text-field
          v-model="pagesInfos.englishTitle"
          label="Título Original"
          hint="Não Obrigaório"
          color="white"
          clearable
          @input="checkSelectes"
        ></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-combobox
          v-model="categoriesSelecteds"
          :items="categoriesList"
          clearable
          dont-fill-mask-blanks
          label="Categoria *"
          multiple
          color="white"
          hint="OBS: Selecione pelo menos uma categoria"
          persistent-hint
          @input="checkSelectes"
        >
          <template
            v-if="item.text"
            slot="selection"
            slot-scope="{ item, parent, selected }"
          >
            <v-chip
              dark
              class="grey lighten-3 black--text"
              :selected="selected"
            >
              <v-avatar color="#ef001c" class="white--text" :size="20">
                <small>{{ item.text.slice(0, 1).toUpperCase() }}</small>
              </v-avatar>
              <span class="pr-2">{{ item.text }}</span>
              <v-icon small @click="parent.selectItem(item)">close</v-icon>
            </v-chip>
          </template>
        </v-combobox>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      required: true,
      default: () => []
    },
    page: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  data() {
    return {
      categoriesList: [],
      pagesInfos: {
        title: '',
        nickname: '',
        englishTitle: '',
        categories: []
      },
      categoriesSelecteds: [],
      rules: {
        length: value =>
          value.length > 2 || 'O Título deve ter no mínimo 3 caracteres'
      }
    }
  },
  async beforeMount() {
    const { commit } = this.$store
    commit('SET_PAGE', {})
    this.categoriesList = this.categories
      .map(category => ({
        text: category.text.trim(),
        value: category.text.trim()
      }))
      .sort()
    this.pagesInfos = Object.assign(
      { title: '', nickname: '', englishTitle: '', categories: [] },
      this.page
    )
  },
  methods: {
    // ...mapActions('create-page', ['setPageInfos', 'setValidStep'])
    checkSelectes(payload) {
      if (payload.filter)
        this.categoriesSelecteds = payload.filter(val => val.text !== undefined)
      if (this.categoriesSelecteds.length)
        this.pagesInfos.categories = this.categoriesSelecteds
      this.$emit('getInfosPages', this.pagesInfos)
      if (this.categoriesSelecteds.length && this.pagesInfos.title)
        this.$emit('setValidStep', true)
    }
  }
}
</script>
