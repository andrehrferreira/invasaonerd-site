<template>
    <InPageContainer
        title="Canais Relacionados"
        type="channels"
        show-edit
        show-delete
        button-edit-bottom
    >
        <v-layout row wrap>
            <template v-if="isMain">
                <InSwiper :items="channels" :height="120" :width="120">
                    <template v-slot:default="channel">
                        <InChannelItem
                            :channel="channel"
                            @click="open(channel.link)"
                        />
                    </template>
                </InSwiper>
            </template>
            <v-layout v-else row justify-space-around wrap pa-2 text-xs-center>
                <v-hover v-for="(channel, index) in channels" :key="index">
                    <template slot-scope="{ hover }">
                        <InChannelItem
                            :hover="hover"
                            :channel="channel"
                            @click="open(channel.link)"
                        />
                    </template>
                </v-hover>
            </v-layout>
        </v-layout>
        <template v-slot:edit>
            <InEditorChannel :channels="channels"
        /></template>
    </InPageContainer>
</template>

<script>
import InPageContainer from '@/components/page/utils/PageContainer'
import InChannelItem from './ChannelItem'
import pageEdit from '@/mixins/pageEdit'
import InSwiper from '@/components/app/Swiper'
import InEditorChannel from './EditorChannel'

export default {
    components: {
        InPageContainer,
        InChannelItem,
        InSwiper,
        InEditorChannel
    },
    mixins: [pageEdit],
    props: {
        channels: {
            type: Array,
            required: false,
            default: () => []
        },
        isMain: {
            type: Boolean,
            required: false,
            dafault: true
        }
    },
    methods: {
        open(link) {
            window.open(link, '_blank')
        }
    }
}
</script>

<style></style>
