<script lang="ts" setup>
import { useStorageLoader } from "~/composables/useStorage";
import { generateSteps } from "~/stores";

useStorageLoader(() => {
    generateSteps();
});
</script>

<template>
  <main class="flex-1 flex flex-col">
    <slot />
  </main>
</template>