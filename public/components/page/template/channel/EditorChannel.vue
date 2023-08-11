<template>
  <InPageEditorContainer
    type="channels"
    title="Canais Relacionados"
    :height="260"
    :width="120"
    @save="save"
  >
    <v-layout row wrap>
      <InSwiper :items="channelsLocal" :height="260" :width="120">
        <template v-slot:default="channel">
          <InChannelItem :channel="channel" @click="removeItem(channel)" />
        </template>
      </InSwiper>
    </v-layout>
    <InPageSearch
      title="Canais Relacionados"
      :loading="loading"
      :empty="empty"
      :search="search"
      @search="getChannelsList"
    >
      <v-layout row wrap grid-list-lg fluid>
        <v-flex v-for="(channel, index) in channelsList" :key="index" pa-2>
          <v-hover>
            <template slot-scope="{ hover }">
              <InChannelItem
                :hover="hover"
                :channel="channel"
                @click="selectItem(channel)"
              />
            </template>
          </v-hover>
        </v-flex>
      </v-layout>
    </InPageSearch>
  </InPageEditorContainer>
</template>

<script>
import InSwiper from '@/components/app/Swiper'
import InChannelItem from './ChannelItem'
import { mapGetters } from 'vuex'
import pageEdit from '@/mixins/pageEdit'
import InPageEditorContainer from '@/components/page/utils/PageEditorContainer'
import InPageSearch from '@/components/page/utils/PageSearch'

export default {
  components: {
    InSwiper,
    InChannelItem,
    InPageEditorContainer,
    InPageSearch
  },
  mixins: [pageEdit],
  props: {
    channels: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      channelsList: [],
      channelsLocal: Object.assign([], this.channels),
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
      if (val && val.title) this.search = val.title
    }
  },
  beforeMount() {
    this.search = this.page.title
    this.getChannelsList(this.search, true)
  },
  methods: {
    async getChannelsList(search, force = false) {
      if (
        search &&
        (force || this.search.toLowerCase() != search.toLowerCase())
      ) {
        this.search = search
        this.empty = false
        this.loading = true
        try {
          const data = await this.$axios.$get(
            `youtube/channel?search=${encodeURIComponent(search)}`
          )
          this.channelsList = data.filter(
            channel => !this.channelsLocal.some(b => b.id == channel.id)
          )
          this.loading = false
        } catch (error) {
          this.loading = false
          this.error = true
        }
      } else if (search == '') {
        this.empty = true
      }
    },
    selectItem(channel) {
      this.channelsLocal.push(channel)
      this.channelsList = this.channelsList.filter(b => b.id != channel.id)
      this.empty = false
    },
    removeItem(channel) {
      this.channelsLocal = this.channelsLocal.filter(b => b.id != channel.id)
      this.channelsList.push(channel)
      this.empty = false
    },
    save() {
      this.changes = {
        type: 'channels',
        action: 'update'
      }
      this.pageChange = {
        channels: this.channelsLocal
      }
      this.saveStore()
      this.$toast({
        message: `Edições dos canais relacionados gravado para envio`,
        color: 'success',
        icon: 'check-circle'
      })
    }
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 5px;
}
</style>
