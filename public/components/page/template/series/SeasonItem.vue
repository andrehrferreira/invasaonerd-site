<template>
  <v-card :title="season.name" @click="$emit('click')">
    <in-image
      :alt="season.name"
      :src="'https://image.tmdb.org/t/p/w500' + season.poster_path"
      :height="`${height}px`"
    >
      <v-container
        fluid
        align-content-end
        align-end
        class="in-movie-preview-fade"
      >
        <v-layout wrap row align-end justify-end mb-5>
          <v-flex xs12>
            <h2 class="mb-0  ml-2">
              {{ season.name }}
            </h2>
          </v-flex>
          <v-flex xs12>
            <p class="data mb-1">
              {{ showDate }}
            </p>
          </v-flex>
          <v-flex xs12>
            <p mt-3 mb-0 pr-5 class="in-seasons-img-text-p">
              {{ formatOverview(season.overview) }}
            </p>
          </v-flex>
          <v-flex xs12>
            <v-layout align-center justify-center align-content-center>
              <v-tooltip :open-delay="50" :close-delay="50" bottom>
                <v-btn
                  slot="activator"
                  icon
                  class="in-see-less-text"
                  @click="$emit('click')"
                >
                  <v-icon>add</v-icon>
                </v-btn>
                <span>Ver mais</span>
              </v-tooltip>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </in-image>
  </v-card>
</template>

<script>
export default {
  props: {
    season: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    height() {
      const { breakpoint } = this.$vuetify
      if (breakpoint.width < 560) {
        return 350
      } else {
        return 500
      }
    },
    logo() {
      return this.season.imdb ? '/img/IMDB_Logo_2016.png' : '/img/tmdb_logo.png'
    },
    showDate() {
      const date = new Date(this.season.air_date)
      return date instanceof Date && !isNaN(date)
        ? date.toLocaleDateString()
        : this.season.air_date
    }
  },
  methods: {
    starsRate(rate, number) {
      return number <= parseInt(rate) / 2 ? 'star' : 'star_border'
    },
    formatOverview(text) {
      return (
        text
          .split('')
          .filter((letter, index) => {
            return index <= 200
          })
          .join('') + (text.length ? '...' : '')
      )
    }
  }
}
</script>

<style scoped>
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

.data {
  font-size: 0.9rem;
  color: #ff3c3c;
  font-weight: 400;
  margin-left: 0.8rem;
}

.container {
  height: 100%;
  display: flex;
  padding: 8px;
}

.in-movie-small {
  font-size: 14px;
  font-weight: 300;
  color: rgba(255, 255, 255, 1);
}
.imdb_img {
  height: auto;
  width: 40px;
  margin-left: 10px;
  margin-bottom: 5px;
}
.second {
  display: flex;
}
.in-seasons-img-text-p {
  font-size: 1rem;
  font-weight: 400;
  max-width: 95%;
  max-height: 50px;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
}
</style>
