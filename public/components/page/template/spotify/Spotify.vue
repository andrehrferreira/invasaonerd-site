<template>
    <section ref="spotify" class=" animated fadeIn" style="padding: 10px 0;">
        <v-layout column wrap>
            <v-flex>
                <UtilsButtonDelete
                    title="Remover box do Spotify"
                    type="spotify"
                />
            </v-flex>
            <v-flex>
                <v-layout id="spotify" row justify-center pa-2>
                    <no-ssr>
                        <iframe
                            :src="'https://open.spotify.com/embed/' + getId()"
                            style="width: 100%;"
                            height="380"
                            frameborder="0"
                            allowtransparency="true"
                            allow="encrypted-media"
                        />
                    </no-ssr>
                </v-layout>
            </v-flex>
        </v-layout>
    </section>
</template>

<script>
import UtilsButtonDelete from '../../utils/ButtonDelete'
export default {
    components: {
        UtilsButtonDelete
    },
    props: {
        url: {
            type: String,
            required: true,
            default: () => ''
        }
    },
    methods: {
        getId() {
            var parts = this.url.split('/')
            return [parts[parts.length - 2], parts[parts.length - 1]].join('/')
        }
    }
}
</script>

<style></style>
