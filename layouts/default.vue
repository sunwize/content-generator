<script lang="ts" setup>
import { useStore } from "~/stores";

const store = useStore();

onMounted(() => {
    store.generateSteps();
});
</script>

<template>
  <main class="flex-1 flex flex-col">
    <slot />
  </main>
</template>