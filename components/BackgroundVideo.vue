<script lang="ts" setup>
import video from "~/assets/videos/shop.mp4";

const videoElement = ref<HTMLVideoElement>();

onMounted(() => {
    videoElement.value?.load();
    videoElement.value?.play();
});
</script>

<template>
  <video
    ref="videoElement"
    :src="video"
    type="video/mp4"
    loop
    muted
    class="absolute inset-0 object-cover z-0 pointer-events-none"
  />
</template>