<template>
    <v-layout row>
        <v-card :width="bp.mdAndUp ? '480px' : '280px'">
            <v-card-title class="py-2">
                <p class="mb-0 title">Notificações</p>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text
                v-show="notificationsList.length"
                class="px-0 py-0"
                :style="styles"
            >
                <v-layout
                    v-for="(notification, index) of notificationsList"
                    :key="index"
                    row
                    wrap
                    class="pa-1"
                    style="cursor: pointer;"
                    @click.stop="redirectToHref(notification)"
                >
                    <v-hover>
                        <v-flex
                            slot-scope="{ hover }"
                            xs12
                            :class="
                                'pa-1 ' +
                                    (!notification.clicked
                                        ? hover
                                            ? 'grey darken-1'
                                            : 'grey darken-2'
                                        : hover
                                        ? ' grey darken-1 '
                                        : '')
                            "
                        >
                            <v-layout row justify-start>
                                <v-flex v-if="notification.image" class="pa-2">
                                    <v-avatar size="36">
                                        <v-img
                                            :src="notification.image"
                                            cover
                                        ></v-img>
                                    </v-avatar>
                                </v-flex>
                                <v-flex>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <p class="mb-1">
                                                {{ notification.message }}
                                            </p>
                                        </v-flex>
                                        <v-flex xs12>
                                            <p
                                                class="mb-0 caption font-italic grey--text"
                                            >
                                                {{
                                                    new Date(
                                                        notification.timestamp
                                                    ).toLocaleString()
                                                }}
                                            </p>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-hover>
                </v-layout>
            </v-card-text>
            <v-card-text v-show="notificationsList.length == 0"
                >Não há notificações para exibir</v-card-text
            >
        </v-card>
    </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: {
        ...mapGetters('auth', ['notificationsList', 'getNewNotifications']),
        bp() {
            const { breakpoint } = this.$vuetify
            return breakpoint || {}
        },
        styles() {
            return {
                maxHeight: this.bp.mdAndUp ? '600px' : '450px',
                overflowY: 'auto'
            }
        }
    },
    methods: {
        ...mapActions('auth', ['setOpenNotification']),
        async redirectToHref(notification) {
            const path = this.changeHref(notification.href)
            try {
                await this.$axios.$post('/user/notifications', { notification })
                this.setOpenNotification(notification)
                this.$emit('close-notification')
            } catch (error) {}
            this.$router.push('/' + path)
        },
        changeHref(url) {
            return url
                .replace('http://', '')
                .replace('https://', '')
                .split(/[/]/)
                .filter(s => s)
                .splice(1)
                .join('/')
        }
    }
}
</script>

<style scoped>
hr.v-divider {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}
</style>
