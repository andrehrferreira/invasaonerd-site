<template>
  <v-layout row wrap>
    <v-dialog
      v-model="modal"
      class="in-specialborder"
      dark
      max-width="1100px"
      transition="dialog-transition"
      persistent
    >
      <div v-if="selected.src" class="in-specialborder-modal-series">
        <in-image alt="Imagem destaque" :src="selected.src">
          <v-fab-transition class="mt-2">
            <v-btn
              class="mt-2"
              color="#f1041f"
              fab
              dark
              small
              absolute
              right
              @click.stop="modal = false"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-fab-transition>
        </in-image>
        <InSwiper
          :key="key"
          type="progressbar"
          :items="images"
          :height="100"
          :style="{
            marginBottom: '0px'
          }"
          :breakpoints="breakpoints"
          :slides-per-view="5"
        >
          <template v-slot:default="image">
            <in-image
              alt="Imagens"
              :src="image.src"
              @click="selectImage(image)"
            ></in-image>
          </template>
        </InSwiper>
      </div>
    </v-dialog>
    <v-layout pa-2>
      <InSwiper
        :key="key"
        type="progressbar"
        :space-between="20"
        :items="images"
        :breakpoints="breakpoints"
        :slides-per-view="5"
      >
        <template v-slot:default="image">
          <in-image
            alt="Imagens"
            :src="image.src"
            @click="selectImage(image)"
          ></in-image>
        </template>
      </InSwiper>
    </v-layout>
  </v-layout>
</template>

<script>
import InSwiper from '@/components/app/Swiper'
export default {
  components: {
    InSwiper
  },
  props: {
    images: {
      type: Array,
      required: true,
      default: () => []
    },
    keyItem: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
      key: this.keyItem,
      modal: false,
      selected: {}
    }
  },
  computed: {
    breakpoints() {
      return {
        1024: {
          slidesPerView: 4,
          spaceBetween: 15
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 15
        }
      }
    }
  },
  watch: {
    keyItem(val) {
      this.key = ++val
      this.forceRerender()
    }
  },
  methods: {
    forceRerender() {
      this.$forceUpdate()
    },
    selectImage(image) {
      this.selected = image
      this.modal = true
    }
  }
}
</script>

<style scoped>
.in-specialborder-modal-series {
  border: 1px solid #3c3c3c;
  -webkit-box-shadow: inset 0px 0px 1px 1px rgba(64, 64, 64, 1);
  -moz-box-shadow: inset 0px 0px 1px 1px rgba(64, 64, 64, 1);
  box-shadow: inset 0px 0px 1px 1px rgba(64, 64, 75, 1);
}
.in-specialborder {
  background: rgba(0, 0, 0, 1) !important;
  border: 1px solid #000;
  -webkit-box-shadow: inset 0px 0px 1px 1px rgba(64, 64, 64, 1);
  -moz-box-shadow: inset 0px 0px 1px 1px rgba(64, 64, 64, 1);
  box-shadow: inset 0px 0px 1px 1px rgba(64, 64, 64, 1);
  /*border:1px solid #404040;
  outline: 1px solid #000;*/
}
</style>
