<template>
  <InSharedModalDetails
    :image="movie.cover"
    :title="movie.title"
    :overview="movie.overview"
    :loading="loading"
    :href="href"
    :links="movie.links || {}"
    @close-modal="closeModal"
    @links="addLinks"
  >
    <InPageTitle font-size="22px">Trailers:</InPageTitle>
    <template v-if="movie.traillers && movie.traillers.length">
      <InSharedVideos
        :scroll="false"
        :is-main="true"
        :videos="movie.traillers"
      />
    </template>
    <template v-else>
      <span>Este filme não possui trailer</span>
    </template>
  </InSharedModalDetails>
</template>

<script>
import InPageTitle from '@/components/page/utils/PageTitle'
import InSharedModalDetails from '../shared/SharedModalDetails'
import InSharedVideos from '../shared/SharedVideos'
import pageEdit from '@/mixins/pageEdit'
export default {
  components: {
    InPageTitle,
    InSharedModalDetails,
    InSharedVideos
  },
  mixins: [pageEdit],
  props: {
    movie: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      modal: true,
      seasonDetail: {},
      error: false,
      loading: false,
      showSerieIndex: 0,
      traillers: []
    }
  },
  computed: {
    href() {
      const urlBase = 'https://www.google.com.br/search?tbm=shop&q=filme+'
      const nameSerie = this.movie.original_title
        .toLowerCase()
        .split(' ')
        .join('+')
      return (
        urlBase +
        nameSerie +
        '&spell=1&sa=X&ved=0ahUKEwjEusuhw9ndAhVFjZAKHZaIBlUQBQigAigA&biw=2560&bih=938'
      )
    }
  },

  methods: {
    redirectTo(link) {
      window.open(link, '_blank')
    },
    closeModal() {
      this.$emit('close-modal')
    },
    toHttps: link => {
      if (link) return link.replace('http://', 'https://')
      return link
    },
    addLinks(links) {
      this.editPageGeneral({
        type: 'movies',
        key: 'id',
        value: this.movie.id,
        data: { links }
      })
    }
  }
}
</script>

<style scoped>
.container-main {
  background-color: rgba(0, 0, 0, 0.8);
}
.in-modal-border {
  border: 1px solid #000;
  -webkit-box-shadow: inset 0px 0px 1px 1px rgba(255, 255, 255, 0.8);
  -moz-box-shadow: inset 0px 0px 1px 1px rgba(255, 255, 255, 0.8);
  box-shadow: inset 0px 0px 1px 1px rgba(255, 255, 255, 0.8);
  /*border:1px solid #404040;
    outline: 1px solid #000;*/
}
.in-movie-preview-fade {
  background: rgba(0, 0, 0, 1);
  background: -moz-linear-gradient(
    45deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(1, 1, 1, 1) 5%,
    rgba(18, 18, 18, 0.15) 100%
  );
  background: -webkit-gradient(
    left bottom,
    right top,
    color-stop(0%, rgba(0, 0, 0, 1)),
    color-stop(5%, rgba(1, 1, 1, 1)),
    color-stop(100%, rgba(18, 18, 18, 0.15))
  );
  background: -webkit-linear-gradient(
    45deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(1, 1, 1, 1) 5%,
    rgba(18, 18, 18, 0.15) 100%
  );
  background: -o-linear-gradient(
    45deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(1, 1, 1, 1) 5%,
    rgba(18, 18, 18, 0.15) 100%
  );
  background: -ms-linear-gradient(
    45deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(1, 1, 1, 1) 5%,
    rgba(18, 18, 18, 0.15) 100%
  );
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(1, 1, 1, 1) 5%,
    rgba(18, 18, 18, 0.15) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#000000', endColorstr='#121212', GradientType=1);
  height: 100%;
}
</style>
