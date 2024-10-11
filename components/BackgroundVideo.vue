<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { useStore } from "~/stores";

const { video } = storeToRefs(useStore());

const videoElement = ref<HTMLVideoElement>();

onMounted(() => {
    watch(video, async (value) => {
        if (value && videoElement.value) {
            videoElement.value.src = (await import(`~/assets/videos/${value}.mp4`)).default;
            videoElement.value?.play();
        }
    }, { immediate: true });
});
</script>

<template>
  <video
    ref="videoElement"
    type="video/mp4"
    loop
    muted
    class="absolute inset-0 object-cover z-0 pointer-events-none"
  />
</template>