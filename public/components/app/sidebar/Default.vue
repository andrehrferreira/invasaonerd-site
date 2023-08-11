<template>
    <v-list dense>
        <v-list-tile
            v-if="!isEnabledNotification"
            @click.prevent.stop="getPermissionOneSignal"
        >
            <v-list-tile-action>
                <v-tooltip :open-delay="50" :close-delay="50" right>
                    <v-btn slot="activator" icon>
                        <v-icon>add_alert</v-icon>
                    </v-btn>
                    <span>Ativar Notificações</span>
                </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>Ativar Notificações</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
    </v-list>
</template>

<script>
import fcmMixins from '@/mixins/fcm'
export default {
    mixins: [fcmMixins]
}
</script>

<style></style>
