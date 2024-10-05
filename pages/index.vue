<script lang="ts" setup>
import LivePreview from "~/components/LivePreview.vue";
import PreviewStatusBar from "~/components/PreviewStatusBar.vue";
import Recorder from "~/components/Recorder.vue";
import Settings from "~/components/settings/index.vue";
import { generateSteps } from "~/stores";

onMounted(() => {
    generateSteps();
});
</script>

<template>
  <div class="flex-1 flex flex-col">
    <div class="flex-1 grid grid-cols-12">
      <div class="col-span-7 flex flex-col px-3 py-6">
        <Settings />
      </div>
      <ClientOnly>
        <div class="col-span-5 flex gap-3 px-3 py-6">
          <div class="flex flex-col gap-12 bg-slate-900 rounded-lg px-3 py-2">
            <PreviewStatusBar />
            <Recorder target-selector="#live-preview" />
          </div>
          <div class="flex-1 flex items-start justify-center bg-white/20 rounded-lg p-3">
            <LivePreview />
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>