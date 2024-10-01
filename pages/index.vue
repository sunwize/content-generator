<script lang="ts" setup>
import LivePreview from "~/components/LivePreview.vue";
import PreviewStatusBar from "~/components/PreviewStatusBar.vue";
import Settings from "~/components/settings/index.vue";
import { generateSteps } from "~/stores";

onMounted(() => {
    generateSteps();
});
</script>

<template>
  <div class="flex-1 flex flex-col">
    <div class="flex-1 grid grid-cols-12">
      <div class="col-span-8 flex flex-col px-3 py-6">
        <Settings />
      </div>
      <div class="col-span-4 flex flex-col gap-3 px-3 py-6">
        <ClientOnly>
          <PreviewStatusBar />
        </ClientOnly>
        <div class="flex-1 flex items-start justify-center bg-white/20 rounded-xl p-6">
          <LivePreview />
        </div>
      </div>
    </div>
  </div>
</template>