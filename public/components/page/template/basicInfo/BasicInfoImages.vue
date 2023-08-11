<template>
  <div>
    <v-stepper-step v-if="showAvatar" :complete="e6 > 1" step="1" editable>
      Avatar
      <small v-if="avatar">Tornar a foto do avatar como foto padrão?</small>
      <small v-show="images.avatar">
        Atualmente está página está usando o avatar do
        {{ images.avatar }}
      </small>
    </v-stepper-step>

    <v-stepper-content v-if="showAvatar" step="1">
      <v-layout v-if="avatar" justify-center align-center>
        <v-img max-height="250px" contain :src="avatar"></v-img>
      </v-layout>
      <v-layout v-else justify-center align-center>
        Não existe nenhum avatar cadastrado
      </v-layout>
      <v-divider></v-divider>
      <v-layout v-if="avatar" row wrap>
        <v-flex xs12 md6>Adicionar essa imagem como padrão?</v-flex>
        <v-flex xs12 md6>
          <v-layout justify-end align-center>
            <v-btn
              flat
              @click="$emit('addType', { type: 'avatar', value: false })"
              >Não</v-btn
            >
            <v-btn
              color="primary"
              @click="$emit('addType', { type: 'avatar', value: true })"
              >Sim</v-btn
            >
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout v-else row wrap justify-end align-center>
        <v-btn
          color="primary"
          @click="$emit('addType', { type: 'avatar', value: false })"
          >Continuar</v-btn
        >
      </v-layout>
    </v-stepper-content>

    <v-stepper-step v-if="showCover" :complete="e6 > 2" step="2" editable>
      Capa
      <small v-if="cover"
        >Tornar a foto do cover como foto padrão no avatar?</small
      >
      <small v-show="images.cover">
        Atualmente você está usando a foto de capa do
        {{ images.cover }}
      </small>
    </v-stepper-step>

    <v-stepper-content v-if="showCover" step="2">
      <v-layout v-if="cover" justify-center align-center>
        <v-img max-height="250px" contain :src="cover"></v-img>
      </v-layout>

      <v-layout v-else justify-center align-center>
        Não existe nenhuma foto de capa cadastrada
      </v-layout>
      <v-divider></v-divider>
      <v-layout v-if="cover" row wrap>
        <v-flex xs12 md6
          >Adicionar essa imagem como padrão na foto de capa?</v-flex
        >
        <v-flex xs12 md6>
          <v-layout justify-end align-center>
            <v-btn
              flat
              @click="$emit('addType', { type: 'cover', value: false })"
              >Não</v-btn
            >
            <v-btn
              color="primary"
              @click="$emit('addType', { type: 'cover', value: true })"
              >Sim</v-btn
            >
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout v-else row wrap justify-end align-center>
        <v-btn
          color="primary"
          @click="$emit('addType', { type: 'cover', value: false })"
          >Continuar</v-btn
        >
      </v-layout>
    </v-stepper-content>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    e6: {
      type: [Number, String],
      required: true,
      default: 0
    },
    cover: {
      type: String,
      default: null
    },
    avatar: {
      type: String,
      default: null
    },
    showCover: {
      type: Boolean,
      default: true
    },
    showAvatar: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters({
      images: 'getPageConfig'
    })
  }
}
</script>
