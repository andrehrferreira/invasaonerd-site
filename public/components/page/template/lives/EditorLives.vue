<template>
  <PageEditorContainer type="lives" title="Lives" @save="save">
    <v-layout row wrap>
      <v-flex xs12 d-flex>
        <v-layout justify-start>
          <h5>Pesquisar: Lives</h5>
        </v-layout>
      </v-flex>
      <v-flex sm12 sm8 md9 lg10 xl11>
        <v-text-field
          v-model="search"
          placeholder="Buscar por:"
          :disabled="loading"
          @keyup.enter="getStreamsList"
          @input="error = false"
        ></v-text-field>
      </v-flex>
      <v-flex sm12 sm4 md3 lg2 xl1>
        <v-layout class="px-2">
          <v-btn dark block :loading="loading" @click.stop="getStreamsList">
            <v-icon class="mr-2">search</v-icon>Buscar
          </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
    <template v-if="loading">
      <InLoading />
    </template>
    <v-layout v-else-if="!empty" row wrap>
      <v-flex d-flex xs12>
        <v-layout justify-start>
          <h5>Lives</h5>
        </v-layout>
      </v-flex>
      <v-flex xs12>
        <hr />
      </v-flex>
      <v-flex xs12>
        <v-layout row wrap>
          <InSwiper :items="streamsLocal" :height="250" :width="240">
            <template v-slot:default="stream">
              <InLiveItem :stream="stream" />
            </template>
          </InSwiper>
        </v-layout>
      </v-flex>
    </v-layout>
    <template v-else>
      <SearchEmpty
    /></template>
  </PageEditorContainer>
</template>

<script>
import InSwiper from '@/components/app/Swiper'
import InLiveItem from './LiveItem'
import InLoading from '@/components/app/Loading'
import { mapGetters } from 'vuex'
import pageEdit from '@/mixins/pageEdit'
import PageEditorContainer from '@/components/page/utils/PageEditorContainer'
import SearchEmpty from '@/components/page/utils/SearchEmpty'

export default {
  components: {
    InLoading,
    InSwiper,
    InLiveItem,
    PageEditorContainer,
    SearchEmpty
  },
  mixins: [pageEdit],
  props: {
    streams: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      streamsLocal: Object.assign([], this.streams),
      loading: false,
      error: false,
      search: '',
      empty: false
    }
  },
  computed: {
    ...mapGetters({
      page: 'getPage'
    })
  },
  watch: {
    page(val) {
      if (val && (val.lives || val.title)) this.search = val.lives || val.title
    }
  },
  beforeMount() {
    this.search = this.page.lives || this.page.title
    if (!this.page.streams) this.getStreamsList()
  },
  methods: {
    async getStreamsList() {
      if (this.search) {
        this.empty = false
        this.loading = true
        try {
          this.streamsLocal = await this.$axios.$get(
            `lives?search=${encodeURIComponent(this.search)}`
          )
          this.loading = false
        } catch (error) {
          this.loading = false
          this.error = true
        }
      } else {
        this.empty = true
      }
    },
    save() {
      if (this.search) {
        this.changes = {
          type: 'lives',
          action: 'update'
        }
        this.pageChange = {
          lives: this.search,
          streams: this.streamsLocal
        }
        this.saveStore()
        this.$toast({
          message: `Edições da live gravada para envio`,
          color: 'success',
          icon: 'check-circle'
        })
      } else {
        this.$toast({
          message: `Informe um termo válido para salvar`,
          color: 'warning',
          icon: 'info'
        })
      }
    }
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 5px;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #666;
  margin: 1em 0;
  padding: 0;
}
</style>
