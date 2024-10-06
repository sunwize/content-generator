<script lang="ts" setup>
import { useStorageLoader } from "~/composables/useStorage";

useStorageLoader();
</script>

<template>
  <main class="flex-1 flex flex-col">
    <slot />
  </main>
</template>