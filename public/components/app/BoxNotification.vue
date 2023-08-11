<template>
    <v-card
        v-show="notificationBox"
        dark
        :class="{
            'in-box-notification': true,
            animated: true,
            bounceInUp: notificationBox,
            slower: true,
            bounceOutLeft: !notificationBox
        }"
    >
        <v-card-text>
            <v-layout row justify-center align-center>
                <v-flex xs2>
                    <i class="far fa-bell fa-3x"></i>
                </v-flex>
                <v-flex xs10 align-self-center>
                    Gostaríamos de te enviar notificações sobre atualizações das
                    páginas que você segue
                </v-flex>
            </v-layout>
        </v-card-text>
        <v-card-actions>
            <v-layout justify-end>
                <v-btn outline @click.prevent.stop="setNotificationBox(false)"
                    >Agora não</v-btn
                >
                <v-btn
                    color="primary"
                    @click.prevent.stop="getPermissionOneSignal"
                    >Aceitar</v-btn
                >
            </v-layout>
        </v-card-actions>
    </v-card>
</template>
<script>
import fcmMixins from '@/mixins/fcm'
import { mapGetters, mapActions } from 'vuex'
export default {
    mixins: [fcmMixins],
    computed: {
        ...mapGetters('app', ['notificationBox'])
    },
    watch: {
        notificationBox(val) {
            const value = JSON.stringify({
                state: val,
                timestamp: new Date().getTime()
            })
            localStorage.setItem('notification-box', value)
        }
    },
    beforeMount() {
        if (process.browser) {
            this.startBoxNotification()
        }
    },
    methods: {
        ...mapActions('app', ['setNotificationBox']),
        startBoxNotification() {
            if (localStorage.hasOwnProperty('notification-box')) {
                const box = JSON.parse(localStorage.getItem('notification-box'))
                if (
                    box.state == false &&
                    this.$diffDate(box.timestamp, new Date().getTime()) > 7
                ) {
                    this.setNotificationBox(true)
                } else if (box.state) {
                    this.setNotificationBox(true)
                }
            } else {
                this.setNotificationBox(true)
            }
        }
    }
}
</script>
<style lang="scss">
.in-box-notification {
    position: fixed;
    bottom: 15px;
    left: 15px;
    z-index: 3000;
    width: 400px;
    height: 130px;
    border-radius: 10px;
}
@-moz-document url-prefix() {
    .in-box-notification {
        height: 150px;
    }
}
@media only screen and (max-width: 600px) {
    .in-box-notification {
        left: 5px;
    }
}
@media only screen and (min-width: 320px) and (max-width: 369px) {
    .in-box-notification {
        width: 310px;
        height: 150px;
    }
}

@media only screen and (min-width: 370px) and (max-width: 600px) {
    .in-box-notification {
        width: 370px;
    }
}
</style>
