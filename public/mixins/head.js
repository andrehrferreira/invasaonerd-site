export default {
    head() {
        let meta = [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            }
        ]
        let { metatags } = this

        if (metatags.seo)
            metatags.seo.map(key => {
                addTag(key, '', metatags, 'name')
            })

        if (metatags.facebook)
            metatags.facebook.map(key => {
                addTag(key, 'og:', metatags, 'property')
            })

        if (metatags.twitter)
            metatags.twitter.map(key => {
                addTag(key, 'twitter:', metatags, 'property')
            })

        function addTag(key, pref, obj, prop, ignore, divider = '') {
            const content = obj[key]
            let name =
                ignore != null && ignore == key
                    ? pref
                    : `${pref}${divider}${key}`
            if (typeof content == 'string') {
                meta.push({
                    hid: name,
                    content,
                    [prop]: name
                })
            } else if (Array.isArray(content)) {
                content.map(item => {
                    Object.entries(item).map(([keyC]) => {
                        addTag(
                            keyC,
                            `${name.slice(0, name.length - 1)}`,
                            item,
                            'property',
                            'url',
                            ':'
                        )
                    })
                })
            } else if (typeof content == 'object') {
                Object.entries(content).map(([keyC]) => {
                    addTag(keyC, `${name}`, content, 'property', 'url', ':')
                })
            }
        }
        return {
            title: `${metatags.title} - Invasão Nerd`,
            meta
        }
    }
}
