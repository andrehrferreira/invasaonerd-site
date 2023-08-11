<template>
    <div
        px-0
        class="container-fluid in-cover animated fadeIn in-specialborder"
        :height="height"
    >
        <div>
            <div v-if="adding && editingType === 'cover'">
                <Croppa
                    v-model="imgCover"
                    :height="500"
                    auto-sizing
                    prevent-white-space
                    canvas-color="lightgray"
                    placeholder="Adicionar uma capa"
                    :initial-image="cover"
                ></Croppa>
            </div>
            <in-image
                v-else-if="cover"
                id="cover"
                :height="height"
                max-height="500px"
                min-height="200px"
                width="100%"
                :alt="alt"
                :src="cover"
            >
                <slot name="social-links"></slot>
                <ButtonEdit
                    bottom
                    type="cover"
                    :show="
                        $vuetify.breakpoint.mdAndUp && editingType != 'avatar'
                    "
                    classes="buttonEditCover"
                    title="Editar Cover"
                />
            </in-image>
            <div v-else class="in-cover-default">
                <ButtonEdit
                    bottom
                    type="cover"
                    :show="editingType != 'avatar'"
                    classes="buttonEditCover"
                    title="Editar Cover"
                />
            </div>
        </div>
        <div v-if="adding && editingType === 'cover'" class="btn-group-sm">
            <v-tooltip :open-delay="50" :close-delay="50" left>
                <v-btn
                    v-if="buttonState"
                    slot="activator"
                    dark
                    small
                    fab
                    fixed
                    color="info"
                    class="btn-second btn btn-fab animated fadeInUp faster btn-save"
                    @click.stop="setImage"
                >
                    <v-icon>save</v-icon>
                </v-btn>
                <span>Salvar Cover</span>
            </v-tooltip>
        </div>
    </div>
</template>

<script>
import Croppa from 'vue-croppa'
import 'vue-croppa/dist/vue-croppa.css'
import pageEdit from '@/mixins/pageEdit'
import ButtonEdit from '../../utils/ButtonEdit'
export default {
    components: {
        Croppa: Croppa.component,
        ButtonEdit
    },
    mixins: [pageEdit],
    props: {
        cover: {
            type: String,
            required: true,
            default: () => ''
        },
        alt: {
            type: String,
            required: true,
            default: null
        }
    },
    data() {
        return {
            imgCover: {},
            editingCover: false
        }
    },
    computed: {
        height() {
            const {
                breakpoint: { width }
            } = this.$vuetify
            return width / 4
        }
    },
    methods: {
        setImage() {
            window.imgCover = this.imgCover
            this.changes = {
                type: 'cover'
            }
            this.pageChange = {
                cover: this.imgCover.generateDataUrl('image/jpeg', 0.3)
            }
            this.saveStore()
            this.$toast({
                message: 'Cover salvo para envio',
                color: 'success',
                icon: 'check-circle'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
#cover > .v-responsive__content {
    border: 1px solid #000 !important;
    -webkit-box-shadow: inset 0px 0px 1px 1px rgba(64, 64, 64, 1) !important;
    -moz-box-shadow: inset 0px 0px 1px 1px rgba(64, 64, 64, 1) !important;
    box-shadow: inset 0px 0px 1px 1px rgba(64, 64, 64, 1) !important;
}
.buttonEditCover {
    position: relative;
}
.in-cover-default {
    background-color: white;
    min-height: 300px;
    -webkit-transition: 0.2s ease-in-out;
    -moz-transition: 0.2s ease-in-out;
    -o-transition: 0.2s ease-in-out;
    transition: 0.2s ease-in-out;
}

.in-cover-default:hover {
    background-color: rgba(255, 255, 255, 0.8);
}
.croppa-container:hover {
    opacity: 1 !important;
}
.croppa-container {
    width: 100% !important;
}

.croppa-container canvas {
    min-width: 100% !important;
    width: 100% !important;
    height: 500px;
    display: block;
}

.btn-save {
    z-index: 200;
    bottom: 130px;
    right: 24px;
}
</style>
