import $ from 'jquery'
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            timer: null
        }
    },
    beforeMount() {
        if (process.browser) {
            window.addEventListener('scroll', this.handleScroll)
        }
    },
    destroyed() {
        if (process.browser) {
            window.removeEventListener('scroll', this.handleScroll)
        }
    },
    methods: {
        ...mapActions('app', [
            'setScrollTop',
            'setScrollHeight',
            'setClientHeight'
        ]),
        handleScroll(e) {
            if (this.timer) clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setScrollTop(e.target.documentElement.scrollTop)
                this.setScrollHeight(e.target.documentElement.scrollHeight)
                this.setClientHeight(e.target.documentElement.clientHeight)
            }, 10)
        },
        scrollPageTo: payload => {
            if (typeof payload === 'object') {
                $('html, body').animate(
                    {
                        scrollTop:
                            $('#' + payload.el).offset().top - payload.offset
                    },
                    'slow'
                )
            } else {
                $('html, body').animate(
                    {
                        scrollTop: $('#' + payload).offset().top - 120
                    },
                    'slow'
                )
            }
        }
    }
}
