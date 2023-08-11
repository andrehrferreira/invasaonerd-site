<template>
    <v-card
        class="sugestion-card elevation-24"
        :class="{ selected, 'animated pulse faster': selected }"
        :hover="!hide"
        height="100%"
        @click.stop="$emit('click', page)"
    >
        <in-image
            :alt="page.title"
            :src="page.avatar"
            cover
            :lazy-src="page.miniavatar"
            height="100%"
            width="100%"
            class="image-cover"
        >
            <v-container
                fluid
                class="in-container-image px-0 pt-3 pl-3"
                :class="{ 'in-fade': hide }"
            >
                <v-layout row class="texts pa-2">
                    <v-flex class="py-0">
                        <p
                            class="in-fade-image mb-0 white--text font-weight-thin"
                        >
                            <span class="subtitle-1">{{ page.title }}</span>
                            <span v-if="page.nickname" class="body-2"
                                >({{ page.nickname }})</span
                            >
                        </p>
                    </v-flex>
                </v-layout>
            </v-container>
        </in-image>
        <div v-show="selected" class="sugestion-card-selected">
            <v-layout align-center column justify-center fill-height>
                <v-icon size="50px" class="animated rotateIn faster white--text"
                    >thumb_up_alt</v-icon
                >
            </v-layout>
        </div>
    </v-card>
</template>

<script>
export default {
    props: {
        page: {
            type: Object,
            require: true,
            default: () => {}
        },
        selected: Boolean,
        hide: Boolean
    }
}
</script>

<style lang="scss" scoped>
$fade: linear-gradient(
    45deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(1, 1, 1, 1) 5%,
    rgba(18, 18, 18, 0.15) 100%
);
.sugestion-card {
    min-height: 174px;
    position: relative;
    .sugestion-card-selected {
        position: absolute;
        top: 0;
        background-color: #0080008c;
        width: 100%;
        height: 100%;
    }
}
.image-cover {
    &:hover {
        .in-container-image {
            background-color: rgb(0, 0, 0);
            background: $fade;
            height: 100%;
        }
    }
    .texts {
        user-select: none;
        background: $fade;
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
    }
}
.in-fade {
    background-color: rgb(0, 0, 0);
    background: $fade;
    height: 100%;
}
</style>
