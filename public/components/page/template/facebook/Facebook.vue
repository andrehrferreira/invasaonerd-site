<template>
    <section ref="facebook" class="animated fadeIn" :style="styles">
        <v-layout column>
            <v-flex>
                <UtilsButtonDelete
                    v-show="!removed"
                    title="Remover box do Facebook"
                    type="facebook"
                />
                <UtilsButtonRedo
                    v-show="removed"
                    :title="`Desfazer operação de remoção do box do Facebook`"
                    :type="type"
                />
            </v-flex>
            <v-flex>
                <v-layout id="facebook" row wrap pa-2>
                    <no-ssr>
                        <iframe
                            :src="urlFacebook"
                            scrolling="no"
                            frameborder="0"
                            class="iframe"
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
import UtilsButtonRedo from '../../utils/ButtonRedo'
import typesRemoved from '@/mixins/typesRemoved'
export default {
    components: {
        UtilsButtonDelete,
        UtilsButtonRedo
    },
    mixins: [typesRemoved],
    props: {
        url: {
            type: String,
            required: true,
            default: () => ''
        }
    },
    data() {
        return {
            type: 'facebook'
        }
    },
    computed: {
        urlFacebook() {
            const url = `https://www.facebook.com/plugins/page.php?href=${encodeURI(
                this.url
            )}
        &width=1500&height=220&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=556136401387797`
            return url
        }
    }
}
</script>

<style scoped>
.iframe {
    border: none;
    overflow: hidden;
    width: 100%;
    height: 220px;
}
</style>
