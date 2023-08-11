import $ from 'jquery'
export default {
    methods: {
        scrollPageTo: payload => {
            if (typeof payload === 'object') {
                $('html, body').animate(
                    {
                        scrollTop:
                            $('#' + payload.el || payload.el).offset().top -
                            payload.offset
                    },
                    'slow'
                )
            } else {
                var element = document.querySelector('#' + payload)
                if (!element) return
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
