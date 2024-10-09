<script lang="ts" setup>
const videoElement = ref<HTMLVideoElement>();

onMounted(() => {
    videoElement.value?.load();
    videoElement.value?.play();
});
</script>

<template>
  <video
    ref="videoElement"
    src="/videos/background.mp4"
    type="video/mp4"
    loop
    muted
    class="absolute inset-0 object-cover z-0 pointer-events-none"
  />
</template>