<script>
import pageEdit from '@/mixins/pageEdit'
import InBasicInfoImages from './BasicInfoImages'
import { mapGetters } from 'vuex'
export default {
    components: {
        InBasicInfoImages
    },
    mixins: [pageEdit],
    data() {
        return {
            e6: 1,
            configs: {
                avatar: false,
                cover: false,
                embbed: false
            }
        }
    },
    computed: {
        ...mapGetters({
            images: 'getPageConfig'
        }),
        avatarText() {
            const { images } = this
            return this.configs.avatar
                ? 'O avatar da página agora é do ' + this.type
                : images.avatar
                ? 'O avatar da página continua sendo do ' + images.avatar
                : 'Está está usando um avatar próprio'
        },
        coverText() {
            const { images } = this
            return this.configs.cover
                ? 'O capa da página agora é do ' + this.type
                : images.cover
                ? 'O capa da página continua sendo do ' + images.cover
                : 'Está está usando um capa próprio'
        }
    },
    methods: {
        addType({ type, value }) {
            this.configs[type] = value
            this.e6++
        },
        next() {
            this.e6++
        },
        convertImage(base64, encoderOptions) {
            return new Promise((resolve, reject) => {
                try {
                    const img = new Image(),
                        canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d')
                    img.src = base64
                    img.onload = function(event) {
                        canvas.width = event.target.width
                        canvas.height = event.target.height
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                        resolve(canvas.toDataURL('image/jpeg', encoderOptions))
                    }
                } catch (error) {
                    reject(error)
                }
            })
        },
        async getImagesYoutube(url) {
            if (!url) return ''
            try {
                return await this.$axios.$get(`/image/geturl?url=${url}`)
            } catch (error) {
                return ''
            }
        },
        async saveImages(type, avatar, cover) {
            try {
                this.pageChange = {}
                this.changes = []
                let images = Object.assign({}, this.images)
                if (this.configs.avatar) {
                    images.avatar = type
                    const base64 = await this.getImagesYoutube(avatar)
                    this.pageChange.avatar = await this.convertImage(
                        base64,
                        0.3
                    )
                    this.pageChange.miniavatar = await this.convertImage(
                        base64,
                        0.1
                    )
                    this.changes.push({
                        type: 'avatar',
                        action: 'update'
                    })
                }

                if (this.configs.cover) {
                    images.cover = type
                    const base64 = await this.getImagesYoutube(cover)
                    this.pageChange.cover = await this.convertImage(base64, 0.3)
                    this.changes.push({
                        type: 'cover',
                        action: 'update'
                    })
                }
                this.pageChange.configs = {
                    images
                }

                this.changes.push({
                    type: 'configs',
                    action: 'update'
                })
                this.saveStore()
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>
