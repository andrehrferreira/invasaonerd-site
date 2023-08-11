<template>
  <section id="categories">
    <v-layout v-if="loading">
      <InLoading width="50px" height="50px" font-size="1em" />
    </v-layout>
    <template v-else>
      <v-layout row wrap justify-space-between>
        <v-flex d-flex>
          <v-layout justify-start>
            <h5>Preview</h5>
          </v-layout>
        </v-flex>
        <v-flex d-flex>
          <v-layout justify-end>
            <v-tooltip :open-delay="50" :close-delay="50" bottom>
              <v-btn
                slot="activator"
                color="success"
                dark
                icon
                @click.stop="save()"
              >
                <v-icon>save</v-icon>
              </v-btn>
              <span>Salvar Categorias</span>
            </v-tooltip>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-combobox
        v-model="categoriesLocal"
        :items="categoriesList"
        clearable
        dont-fill-mask-blanks
        label="Categoria *"
        multiple
        color="white"
        hint="OBS: Selecione pelo menos uma categoria"
        persistent-hint
      >
        <template slot="selection" slot-scope="{ item, parent, selected }">
          <v-chip class="grey lighten-3 black--text" :selected="selected">
            <v-avatar color="#ef001c" class="white--text" :size="20">
              <small>{{ item.slice(0, 1).toUpperCase() }}</small>
            </v-avatar>
            <span class="pr-2">{{ item }}</span>
            <v-icon small @click="parent.selectItem(item)">close</v-icon>
          </v-chip>
        </template>
      </v-combobox>
    </template>
  </section>
</template>

<script>
import InLoading from '@/components/app/Loading'
import pageEdit from '@/mixins/pageEdit'

export default {
  components: {
    InLoading
  },
  mixins: [pageEdit],
  props: {
    categories: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      loading: true,
      categoriesList: [],
      categoriesLocal: this.categories
    }
  },
  async beforeMount() {
    try {
      const categories = await this.$axios.$get('/categories')
      this.categoriesList = categories.map(category => category.text).sort()
      this.loading = false
    } catch (error) {
      this.loading = false
      this.$toast({
        message: `Ocorreu um erro na comunicação com o servidor`,
        color: 'red',
        icon: 'warning'
      })
    }
  },
  methods: {
    save() {
      const { categoriesLocal } = this
      if (categoriesLocal.length) {
        this.changes = {
          type: 'categories',
          action: 'update'
        }
        this.pageChange = {
          categories: categoriesLocal
        }
        this.saveStore()
        this.$toast({
          message: `Edições de categorias gravadas para envio`,
          color: 'success',
          icon: 'check-circle'
        })
      } else {
        this.$toast({
          message: `Selecione pelo menos uma categoria`,
          color: 'orange',
          icon: 'warning'
        })
      }
    }
  }
}
</script>

<style></style>
