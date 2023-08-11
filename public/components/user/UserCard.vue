<template>
    <v-layout
        row
        justify-center
        align-center
        class="pa-3 grey darken-3"
        :style="styles"
    >
        <v-flex class xs4>
            <v-layout justify-center>
                <v-avatar height="55px">
                    <img :src="avatar" :alt="profile.fullname" />
                </v-avatar>
            </v-layout>
        </v-flex>
        <v-flex xs8 class="pl-1">
            <v-layout column>
                <p class="mb-0 in-user-menu-name text-truncate">
                    {{ profile.fullname }}
                </p>
                <p class="mb-0 in-user-info-small-info caption text-truncate">
                    {{ profile.email }}
                </p>
                <p
                    v-show="profile.username"
                    class="mb-0 in-user-info-small-info caption text-truncate"
                >
                    Usuário: {{ profile.username }}
                </p>
                <p class="mb-0 in-user-info-small-info">
                    Points: {{ user.points }}
                    <small v-if="user.superadmin" class="ml-1 px-1 red darken-4"
                        >SuperAdmin</small
                    >
                    <small
                        v-else-if="user.admin"
                        class="ml-1 px-1 orange darken-4"
                        >Admin</small
                    >
                </p>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    props: {
        styles: {
            type: Object,
            required: false,
            default: () => {}
        },
        user: {
            type: Object,
            required: true,
            default: () => []
        }
    },
    computed: {
        avatar() {
            if (!this.user) return '/img/useravatar.png'
            if (this.user.profile.avatar == '/assets/img/useravatar.png') {
                return '/img/useravatar.png'
            }
            return this.user.profile.avatar
        },
        profile() {
            return this.user.profile || {}
        }
    }
}
</script>

<style scoped>
.pa-24 {
    padding: 24px;
}

.mt-24 {
    margin-top: 24px !important;
}

.in-login-bold-title {
    font-size: 2rem;
    font-weight: 500;
    color: white;
    margin-bottom: 8px;
}

.in-login-thin-subtitle {
    font-size: 1.3rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.637);
}

.in-login-info-text {
    font-size: 1rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.637);
    margin-bottom: 40px;
}

.in-link-to-invite {
    color: rgba(243, 54, 54, 0.637);
    font-weight: 500;
    font-size: 1.1rem;
}

.in-link-to-invite:hover {
    text-decoration: underline;
    color: red;
}

#form-change .v-text-field {
    padding-top: 0 !important;
    margin-top: 0 !important;
    padding-bottom: 16px;
}

.in-img-ola-invasor {
    font-size: 1.8rem;
    font-weight: 700;
}

.in-img-text-login {
    font-size: 1.1rem;
    font-weight: 300;
    text-shadow: 0px 1px 1px black;
}

.in-img-text-bold {
    font-weight: 900;
}

.in-user-menu-name {
    font-size: 1.2rem;
    font-weight: 500;
}

.in-user-info-small-info {
    font-size: 0.9rem;
    font-weight: 300;
}
</style>
