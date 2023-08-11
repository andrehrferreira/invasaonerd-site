import { mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            permission: false,
            isEnabledNotification: false,
            numberOfRetries: 0
        }
    },
    watch: {
        numberOfRetries(val) {
            if (val > 3) {
                this.$toast({
                    message:
                        'Não conseguimos ativar as notificações para você.',
                    color: 'warning',
                    icon: 'warning'
                })
            }
        }
    },
    beforeMount() {
        if (process.browser) {
            if (this.hasUserLogged) this.onMessage()
        }
    },
    computed: {
        ...mapGetters('auth', ['hasUserLogged', 'userLogged'])
    },
    methods: {
        ...mapActions('app', ['setNotificationBox']),
        onMessage() {
            this.$fireMess.onMessage(({ notification }) => {
                new Notification(notification.title, notification)
            })
        },
        async addDeviceId(deviceId) {
            if (!this.hasUserLogged) return
            try {
                await this.$axios.$post('/user/devices', {
                    device: deviceId
                })
            } catch (error) {
                console.log(error)
            }
        },
        async getPermissionOneSignal() {
            this.$fireMess
                .requestPermission()
                .then(() => {
                    console.log('Have permission')
                    return this.$fireMess.getToken() //ユーザにプッシュ通知を表示する権限の許可を表示
                })
                .then(currentToken => {
                    console.log(currentToken)
                    if (currentToken) {
                        this.isEnabledNotification = true
                        this.setNotificationBox(false)
                        this.addDeviceId(currentToken)
                    } else {
                        this.numberOfRetries++
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.numberOfRetries++
                    console.log('Error Occurred.')
                })
        }
    }
}
