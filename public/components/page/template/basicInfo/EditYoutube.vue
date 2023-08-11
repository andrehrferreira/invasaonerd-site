<template>
  <section>
    <v-stepper v-model="e6" vertical>
      <InBasicInfoImages
        :cover="youtube.cover"
        :avatar="youtube.avatar"
        :e6="e6"
        @addType="addType"
        @next="next"
      />
      <v-stepper-step :complete="e6 > 3" step="3" editable>
        Vídeos
        <small>Quantos vídeos deseja colocar no Invasão Nerd?</small>
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-layout row column>
          <p>{{ configurations.limits.videos }} vídeos selecionados</p>
          <v-slider
            v-model="configurations.limits.videos"
            thumb-label
            max="50"
            min="0"
          ></v-slider>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap justify-end align-center>
          <v-btn color="primary" @click="next">Continuar</v-btn>
        </v-layout>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 4" step="4" editable>
        Playlists
        <small>Quantas playlists deseja trazer para o Invasão Nerd?</small>
      </v-stepper-step>

      <v-stepper-content step="4">
        <v-layout row column pa-2>
          <p>{{ configurations.limits.playlists }} playlists selecionados</p>
          <v-slider
            v-model="configurations.limits.playlists"
            thumb-label
            max="50"
            min="0"
          ></v-slider>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap justify-end align-center>
          <v-btn color="primary" @click="next">Continuar</v-btn>
        </v-layout>
      </v-stepper-content>
      <v-stepper-step :complete="e6 > 5" step="5" editable>
        Canais Relacionados
        <small
          >Quais canais relacionados você deseja colocar no Invasão Nerd?</small
        >
      </v-stepper-step>

      <v-stepper-content step="5">
        <v-container>
          <v-layout row wrap>
            <template
              v-if="
                youtube.featuredChannelsUrls &&
                  youtube.featuredChannelsUrls.length
              "
            >
              <v-flex
                v-for="item in youtube.featuredChannelsUrls"
                :key="item.id"
                xs3
                pa-2
                column
                justify-center
                align-center
              >
                <v-flex xs12 @click.stop="toggleChannel(item.channelId)">
                  <v-layout text-xs-center justify-center>
                    <v-badge overlap text-xs-center>
                      <v-icon
                        v-if="isSelecteds(item.channelId)"
                        slot="badge"
                        class="animated slideInRight faster"
                        dark
                        small
                        >done</v-icon
                      >
                      <v-layout column justify-end>
                        <v-avatar>
                          <in-image
                            :src="item.thumbnails && item.thumbnails.medium.url"
                            alt="Avatar"
                          />
                        </v-avatar>
                      </v-layout>
                    </v-badge>
                  </v-layout>
                </v-flex>
                <v-flex xs12 pt-1>
                  <v-layout text-xs-center justify-center>
                    <small>{{ item.channelTitle }}</small>
                  </v-layout>
                </v-flex>
              </v-flex>
            </template>
            <template v-else>
              <p>Não encontramos nenhum canal relacionado.</p>
            </template>
          </v-layout>
        </v-container>
        <v-divider></v-divider>
        <v-layout row wrap justify-end align-center>
          <v-btn color="primary" @click="next">Continuar</v-btn>
        </v-layout>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 6" step="6" editable>
        Resumo
        <small>Veja o resumo de suas configurações do Youtube</small>
      </v-stepper-step>

      <v-stepper-content step="6">
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
              <v-list-tile-title>Vídoes</v-list-tile-title>
              <v-list-tile-sub-title>
                {{ configurations.limits.videos }} vídeos selecionados
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Playlists</v-list-tile-title>
              <v-list-tile-sub-title>
                {{ configurations.limits.playlists }} playlists selecionados
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Canais Relacionados</v-list-tile-title>
              <v-list-tile-sub-title>
                {{ featuredChannelsText }}
              </v-list-tile-sub-title>
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
    youtube: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      type: 'Youtube',
      configurations: {}
    }
  },
  computed: {
    featuredChannelsText() {
      const { featuredChannelsUrls } = this.youtube
      const channels = []
      const ids = this.configurations.selectedConfigs.map(({ type }) => type)
      featuredChannelsUrls &&
        featuredChannelsUrls.map(({ channelId, channelTitle }) => {
          if (ids.includes(channelId)) {
            channels.push(channelTitle)
          }
        })
      return channels.join(', ')
    }
  },
  watch: {
    config() {
      this.configurations = Object.assign(
        {
          limits: {
            videos: 20,
            playlists: 30
          },
          selectedConfigs: []
        },
        JSON.parse(JSON.stringify(this.config))
      )
    }
  },
  beforeMount() {
    this.configurations = Object.assign(
      {
        limits: {
          videos: 20,
          playlists: 30
        },
        selectedConfigs: []
      },
      JSON.parse(JSON.stringify(this.config))
    )
  },
  methods: {
    async save() {
      await this.saveImages('Youtube', this.youtube.avatar, this.youtube.cover)
      let youtube = Object.assign({}, this.youtube)
      youtube.config = this.configurations
      const types = this.configurations.selectedConfigs.map(type => type.type)
      const channels = (youtube.featuredChannelsUrls || []).filter(channel => {
        return types.includes(channel.channelId)
      })
      this.pageChange = {
        youtube,
        channels
      }
      this.changes = {
        type: 'youtube',
        action: 'update'
      }
      this.saveStore()
      this.$toast({
        message: 'Configurações do Youtube realizadas com sucesso',
        color: 'success',
        icon: 'check-circle'
      })
      this.$emit('change-step-next')
    },

    toggleChannel(channelId) {
      const { selectedConfigs } = this.configurations
      if (selectedConfigs.some(config => config.type === channelId)) {
        this.configurations.selectedConfigs = selectedConfigs.filter(config => {
          return config.type !== channelId
        })
      } else {
        this.configurations.selectedConfigs.push({
          type: channelId
        })
      }
    },
    isSelecteds(channelId) {
      const { selectedConfigs } = this.configurations
      return selectedConfigs.length
        ? selectedConfigs.some(c => c.type === channelId)
        : false
    }
  }
}
</script>

<style></style>
