<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { useStore } from "~/stores";

const { video } = storeToRefs(useStore());

const videoFiles = [
    "shop",
    "rain_shop",
    "mountain_landscape",
    "halloween",
    "halloween2",
    "halloween3",
    "winter_cottage",
];
</script>

<template>
  <USelect
    v-model="video"
    :options="videoFiles"
    placeholder="Select a video..."
  />
</template>