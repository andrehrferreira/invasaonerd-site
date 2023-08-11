<template>
    <v-autocomplete
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        clearable
        hide-details
        hide-selected
        item-text="name"
        item-value="symbol"
        label="Pesquisar"
        height="30px"
        :prepend-inner-icon="'$vuetify.icons.search'"
        small-chips
    >
        <template v-slot:no-data>
            <v-list-tile>
                <v-list-tile-title>
                    Search for your favorite
                    <strong>Cryptocurrency</strong>
                </v-list-tile-title>
            </v-list-tile>
        </template>
        <template v-slot:selection="{ item, selected }">
            <v-chip :selected="selected" color="blue-grey" class="white--text">
                <v-icon left>
                    mdi-coin
                </v-icon>
                <span v-text="item.name" />
            </v-chip>
        </template>
        <template v-slot:item="{ item }">
            <v-list-tile-avatar
                color="indigo"
                class="headline font-weight-light white--text"
            >
                {{ item.name.charAt(0) }}
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title v-text="item.name" />
                <v-list-tile-sub-title v-text="item.symbol" />
            </v-list-tile-content>
            <v-list-tile-action>
                <v-icon>mdi-coin</v-icon>
            </v-list-tile-action>
        </template>
    </v-autocomplete>
</template>

<script>
export default {
    data: () => ({
        isLoading: false,
        items: [],
        model: null,
        search: null
    }),

    watch: {
        search() {
            // // Items have already been loaded
            // if (this.items.length > 0) return
            // this.isLoading = true
            // // Lazily load input items
            // fetch('https://api.coinmarketcap.com/v2/listings/')
            //   .then(res => res.json())
            //   .then(res => {
            //     this.items = res.data
            //   })
            //   .catch(err => {
            //     console.log(err)
            //   })
            //   .finally(() => (this.isLoading = false))
        }
    }
}
</script>

<style></style>
