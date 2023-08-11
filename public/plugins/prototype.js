import Vue from 'vue'

Vue.use({
    install(Vue) {
        Vue.prototype.$urlify = text => {
            return text.replace(/(((https?:\/\/)|(www\.))[^\s]+)/g, function(
                url,
                b,
                c
            ) {
                var url2 = c == 'www.' ? 'http://' + url : url
                return (
                    '<a href="' +
                    url2 +
                    '" target="_blank" rel="noopener">' +
                    url +
                    '</a>'
                )
            })
        }
        Vue.prototype.$formatNumber = number => {
            if (typeof number === 'number') {
                if (number > 999999) {
                    const nbr = parseFloat((number / 1000000).toFixed(1))
                    const isInt = nbr % 1 === 0
                    return nbr.toFixed(isInt ? 0 : 1) + ' mi'
                } else if (number > 999) {
                    const nbr = parseFloat((number / 1000).toFixed(1))
                    const isInt = nbr % 1 === 0
                    return nbr.toFixed(isInt ? 0 : 1) + ' mil'
                }
            }
            return number
        }
        Vue.prototype.$clearReactive = obj => {
            try {
                return JSON.parse(JSON.stringify(obj))
            } catch (err) {
                return obj
            }
        }
        Vue.prototype.$sleep = ms => {
            return new Promise(resolve => setTimeout(resolve, ms))
        }
        Vue.prototype.$diffDate = (start, end) => {
            const diffTime = Math.abs(
                new Date(start).getTime() - new Date(end).getTime()
            )
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        }
    }
})
