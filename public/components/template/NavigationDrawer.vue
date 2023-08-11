<template>
  <v-navigation-drawer v-model="localDrawer" fixed app>
    <!-- <v-list>
      <v-list-tile v-for="(item, i) in items" :key="i" :to="item.to" router exact>
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="item.title"/>
        </v-list-tile-content>
      </v-list-tile>
    </v-list> -->
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      localDrawer: this.value,
      items: [
        {
          icon: 'apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'bubble_chart',
          title: 'Inspire',
          to: '/inspire'
        }
      ]
    }
  },
  computed: {
    showDrawer() {
      return this.drawer
    }
  },
  watch: {
    value() {
      this.localDrawer = this.value
    },
    localDrawer() {
      this.$emit('input', this.localDrawer)
    }
  }
}
</script>

<style></style>
