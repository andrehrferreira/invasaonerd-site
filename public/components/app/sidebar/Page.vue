<template>
    <v-list subheader dense>
        <v-subheader class="grey--text text-uppercase">PÁGINA</v-subheader>
        <v-list-tile
            v-for="(item, index) in pageItems"
            :key="index"
            :disabled="verifyLocation(item.payload)"
            :class="verifyLocation(item.payload) ? 'grey darken-2' : ''"
            @click.prevent.stop="e => checkUser(e, item.action, item.payload)"
        >
            <v-list-tile-action>
                <v-tooltip
                    :open-delay="50"
                    :close-delay="50"
                    right
                    :disabled="!mini"
                >
                    <v-btn
                        slot="activator"
                        icon
                        :disabled="verifyLocation(item.payload)"
                    >
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-btn>
                    <span>{{ item.text }}</span>
                </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
    </v-list>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    props: {
        mini: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    computed: {
        ...mapGetters(['hasPage', 'hasPageFeedback', 'pageURL']),
        ...mapGetters('auth', ['isAdmin', 'hasUserLogged']),
        ...mapGetters('page', ['editMode', 'editingType', 'adding']),
        pageItems() {
            return [
                {
                    text: this.isAdmin ? 'Criar Página' : 'Sugerir Página',
                    condition: true,
                    action: this.goTo,
                    payload: '/createpage',
                    href: '/createpage',
                    icon: 'note_add'
                },
                {
                    text: 'Editar esta página',
                    condition:
                        !this.editMode &&
                        this.hasPage &&
                        this.$route.name != 'createpage',
                    action: this.setEditMode,
                    payload: !this.editMode,
                    icon: 'edit'
                },
                // {
                //     text: 'Comunidade',
                //     condition: !this.editMode && this.hasPage,
                //     action: this.goTo,
                //     payload: `/page/${this.pageURL}/community?p=1`,
                //     href: `/page/${this.pageURL}/community?p=1`,
                //     icon: 'forum'
                // },
                // {
                //   text: 'Vincular Usuário',
                //   condition: this.editMode && this.isAdmin,
                //   action: this.options.attachUserModal,
                //   icon: 'person_add'
                // },
                {
                    text: 'Excluir Página',
                    condition: this.hasPage && this.$route.name != 'createpage',
                    action: this.sendToDelete,
                    icon: 'delete_forever'
                }
                // {
                //     text: 'Histórico desta Página',
                //     condition: this.isAdmin && this.feedbackDate,
                //     action: this.goTo,
                //     payload: '/logs/' + this.pageURL,
                //     href: '/logs/' + this.pageURL,
                //     icon: 'library_books'
                // }
            ].filter(({ condition }) => condition)
        }
    },
    methods: {
        ...mapActions('app', ['toggleSideBar', 'setModal']),
        ...mapActions('page', ['setEditMode']),
        ...mapActions('auth', ['setModalLogin', 'setRedirectAfterLogin']),
        checkUser(event, action, payload) {
            if (this.hasUserLogged) action(payload)
            else {
                this.setRedirectAfterLogin(payload)
                this.setModalLogin(true)
            }
            this.toggleSideBar(false)
            return false
        },
        goTo(router) {
            this.$router.push(router)
        },
        verifyLocation(path) {
            return this.$route.path == path
        },
        sendToDelete() {
            this.toggleSideBar(false)
            if (this.hasUserLogged) this.setModal('ModalPageDelete')
            else this.setModalLogin(true)
        }
    }
}
</script>

<style></style>
