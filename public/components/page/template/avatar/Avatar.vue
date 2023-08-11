<template>
  <div>
    <div
      v-if="adding && editingType === 'avatar'"
      class="in-avatar in-radius in-specialborder animated fadeIn"
    >
      <Croppa
        id="avatar"
        v-model="imgAvatar"
        auto-sizing
        :height="162"
        :width="162"
        prevent-white-space
        canvas-color="lightgray"
        placeholder="Avatar"
        :initial-image="avatar"
        class="in-avatar-thumb"
      ></Croppa>
    </div>
    <div v-else class="in-avatar in-radius in-specialborder">
      <div v-if="!avatar" class="in-avatar-default">
        <ButtonEdit
          right
          type="avatar"
          styles="position: relative;"
          title="Editar Avatar"
        />
      </div>
      <in-image
        v-if="avatar"
        id="avatar"
        :src="avatar"
        :src-lazy="miniavatar"
        contain
        :alt="alt"
        class="in-avatar-thumb"
      >
        <ButtonEdit
          right
          type="avatar"
          styles="position: relative;"
          title="Editar Avatar"
        />
      </in-image>
    </div>
    <div v-if="adding && editingType === 'avatar'" class="btn-group-sm">
      <v-tooltip :open-delay="50" :close-delay="50" left>
        <v-btn
          v-if="buttonState"
          slot="activator"
          dark
          small
          fab
          fixed
          :loading="loading"
          color="info"
          class="btn-second btn btn-info btn-fab animated fadeInUp faster btn-save"
          @click.stop="setImage"
        >
          <v-icon>save</v-icon>
        </v-btn>
        <span>Salvar Avatar</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import Croppa from 'vue-croppa'
import pageEdit from '@/mixins/pageEdit'
import ButtonEdit from '../../utils/ButtonEdit'
export default {
  components: {
    Croppa: Croppa.component,
    ButtonEdit
  },
  mixins: [pageEdit],
  props: {
    avatar: {
      type: String,
      required: true,
      default: () => {}
    },
    miniavatar: {
      type: String,
      required: true,
      default: () => {}
    },
    alt: {
      type: String,
      required: true,
      default: () => ''
    }
  },
  data() {
    return {
      imgAvatar: {},
      loading: false
    }
  },
  methods: {
    setImage() {
      window.imgAvatar = this.imgAvatar
      this.changes = {
        type: 'avatar',
        action: 'update'
      }
      this.pageChange = {
        avatar: this.imgAvatar.generateDataUrl('image/jpeg', 0.3),
        miniavatar: this.imgAvatar.generateDataUrl('image/jpeg', 0.1)
      }
      this.saveStore()
      this.$toast({
        message: 'Avatar salvo para envio',
        color: 'success',
        icon: 'check-circle'
      })
    }
  }
}
</script>

<style scoped>
.in-avatar {
  position: relative;
  display: block;
  background-color: #333;
  width: 168px;
  height: 170px;
  margin: auto;
  margin-top: -85px;
  padding: 3px;
}

.in-avatar-thumb > canvas {
  max-height: 162px !important;
}
.in-avatar-default {
  background-color: white;
  min-height: 170px;
  -webkit-transition: 0.2s ease-in-out;
  -moz-transition: 0.2s ease-in-out;
  -o-transition: 0.2s ease-in-out;
  transition: 0.2s ease-in-out;
}

.in-avatar-default:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.in-radius {
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
}
.croppa-container:hover {
  opacity: 1 !important;
}

.btn-save {
  z-index: 200;
  bottom: 130px;
  right: 24px; 
}
</style>
