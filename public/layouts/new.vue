<template>
  <v-app dark>
    <NavigationDrawer v-model="drawer" />
    <Toolbar @toggle-drawer="drawer = !drawer" />
    <v-content>
      <v-container fill-height fluid class="pa-0">
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="false" app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import NavigationDrawer from '@/components/template/NavigationDrawer'
import Toolbar from '@/components/template/Toolbar'
export default {
  components: {
    NavigationDrawer,
    Toolbar
  },
  data() {
    return {
      drawer: false
    }
  }
}
</script>
