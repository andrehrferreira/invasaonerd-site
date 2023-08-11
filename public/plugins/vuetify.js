import Vue from 'vue'
import Vuetify, { VSnackbar } from 'vuetify/lib'
import VuetifyToast from './toast'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
    theme: {
        primary: '#ef001c',
        accent: '#1976d2',
        secondary: '#6c757d',
        info: '#17a2b8',
        warning: colors.amber.base,
        error: '#dc3545',
        success: '#4caf50'
    },
    components: {
        VSnackbar
    }
})

Vue.use(VuetifyToast, {
    x: 'center',
    y: 'top',
    vertical: true,
    queueable: true
})
