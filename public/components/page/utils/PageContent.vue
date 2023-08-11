<template>
    <v-card color="transparent" flat>
        <v-container px-2 grid-list-md fluid>
            <v-layout row wrap>
                <slot></slot>
            </v-layout>
        </v-container>
    </v-card>
</template>

<style scoped>
.v-card {
    width: 100%;
}
</style>
