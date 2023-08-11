<template>
  <section class="animated fadeIn pa-2">
    <ul id="wiki" class="in-page-fullinfo">
      <li v-for="([key, value, checked, link], index) of fullinfo" :key="index">
        <div v-if="link">
          <strong>{{ key }}:</strong>
          <a v-if="typeof value === 'string'" :href="link" target="_blank">{{
            value
          }}</a>
          <span v-else-if="typeof value === 'object'">
            <span v-for="(item, indx) of value" :key="indx" class="text-white">
              <a v-if="link[indx]" :href="link[indx]" target="_blank">{{
                item
              }}</a>
              <span v-else class="text-white">{{ item }}</span>
              <v-icon
                v-if="editMode && addingLink !== item"
                :title="'Vincular uma página sobre ' + item"
                color="blue"
                class="in-fullInfo-btn-link"
                @click.stop="toggleLink(item, link[indx])"
                >link</v-icon
              >
              <v-icon
                v-if="addingLink === item"
                title="Cancelar"
                color="#ef001c"
                class="in-fullInfo-btn-link"
                @click.stop="toggleLink(item, link[indx])"
                >close</v-icon
              >
              <span v-if="indx + 1 !== value.length">,</span>
              <v-text-field
                v-if="addingLink === item"
                v-model="newLink"
                :label="item"
                dark
                :value="link[indx] ? link[indx] : ''"
                :placeholder="link[indx] ? link[indx] : ''"
                clearable
                append-icon="save"
                @click:append="saveLink(index, indx)"
              ></v-text-field>
            </span>
          </span>
          <v-icon
            v-if="editMode && typeof value === 'string' && addingLink !== key"
            :title="'Vincular uma página sobre ' + value"
            color="blue"
            class="in-fullInfo-btn-link"
            @click.stop="toggleLink(key, link)"
            >link</v-icon
          >
          <v-icon
            v-if="editMode && typeof value === 'string' && addingLink === key"
            title="Cancelar"
            color="#ef001c"
            class="in-fullInfo-btn-link"
            @click.stop="toggleLink(key, link)"
            >close</v-icon
          >
        </div>
        <div v-else>
          <strong>{{ key }}:</strong>
          <span v-if="typeof value === 'object'">
            {{ value.join(', ') }}
          </span>
          <span v-else>{{ value }}</span>
          <v-icon
            v-if="editMode && addingLink !== key"
            :title="'Vincular uma página sobre ' + key"
            color="blue"
            class="in-fullInfo-btn-link"
            @click.stop="toggleLink(key, link)"
            >link</v-icon
          >
          <v-icon
            v-if="editMode && addingLink === key"
            title="Cancelar"
            color="#ef001c"
            class="in-fullInfo-btn-link"
            @click.stop="toggleLink(key, link)"
            >close</v-icon
          >
        </div>
        <v-text-field
          v-if="addingLink === key"
          v-model="newLink"
          :label="key"
          dark
          :value="link"
          color="accent"
          :placeholder="link ? link : ''"
          clearable
          append-outer-icon="save"
          @click:append-outer="saveLink(index)"
        ></v-text-field>
      </li>
    </ul>
  </section>
</template>

<script>
import pageEdit from '@/mixins/pageEdit'
export default {
  mixins: [pageEdit],
  props: {
    fullinfo: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      addingLink: '',
      newLink: '',
      oldLink: ''
    }
  },
  methods: {
    toggleLink(key, link) {
      this.newLink = link
      this.oldLink = link
      if (this.addingLink === key) this.addingLink = ''
      else this.addingLink = key
    },

    saveLink(index, linksIndex) {
      if (this.newLink || this.oldLink != '') {
        const { fullinfo } = this
        if (linksIndex !== undefined)
          fullinfo[index][3][linksIndex] = this.newLink
        else fullinfo[index][3] = this.newLink
        this.newLink = ''
        this.addingLink = ''
        this.oldLink = ''
        this.changes = {
          type: 'wiki-link',
          action: 'update'
        }
        this.pageChange = {
          fullinfo
        }
        this.saveStore()
      } else {
        this.$toast({
          message: `Link inválido`,
          color: 'orange',
          icon: 'warning'
        })
      }
    }
  }
}
</script>

<style scoped>
.fa-link,
.fa-save {
  cursor: pointer;
}

.in-fullInfo-btn-link {
  margin-bottom: -4px;
}
.in-page-fullinfo {
  margin: none;
  list-style: none;
  padding: 0px;
}
.in-page-fullinfo li {
  padding: 5px;
}
dl,
ol,
ul {
  margin-top: 0;
  margin-bottom: 0;
}
a {
  text-decoration: underline;
  color: #1976d2;
}
</style>
