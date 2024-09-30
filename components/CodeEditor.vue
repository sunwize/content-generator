<script lang="ts" setup>
import hljs from "highlight.js";

import MaterialSymbolsLightContentCopyOutlineRounded from "~icons/material-symbols-light/content-copy-outline-rounded";

type Props = {
  language: string;
};

const props = defineProps<Props>();

const modelValue = defineModel<string>({ required: true });
const codeElement = ref<HTMLElement>();
const tooltip = ref("Copy to clipboard");

const highlightCode = () => {
    if (!codeElement.value) return;

    delete codeElement.value.dataset.highlighted;
    codeElement.value.innerHTML = hljs.highlight(modelValue.value, { language: props.language }).value;
};

const copyToClipboard = () => {
    navigator.clipboard.writeText(modelValue.value);
    tooltip.value = "Copied!";

    setTimeout(() => {
        tooltip.value = "Copy to clipboard";
    }, 1000);
};

onMounted(() => {
    modelValue.value = modelValue.value.trim();
    highlightCode();

    watch(modelValue, () => {
        highlightCode();
    });
});
</script>

<template>
  <div class="bg-slate-800 rounded-lg border border-white/10 shadow-lg">
    <div class="flex items-center justify-between border-b border-white/10 px-3 py-2">
      <p class="text-xs text-white/50 uppercase">
        {{ language }}
      </p>
      <UTooltip
        :text="tooltip"
        :popper="{ placement: 'left' }"
      >
        <UButton
          variant="ghost"
          color="gray"
          class="p-0"
          @click="copyToClipboard"
        >
          <MaterialSymbolsLightContentCopyOutlineRounded class="size-5" />
        </UButton>
      </UTooltip>
    </div>
    <div class="relative bg-slate-900 rounded-b-lg px-3 py-2">
      <textarea
        v-model="modelValue"
        spellcheck="false"
        class="absolute inset-0 px-3 py-2 z-[1] whitespace-pre resize-none outline-none font-mono bg-transparent text-transparent caret-white/80 text-sm leading-relaxed"
      />
      <pre class="relative z-0"><code
      ref="codeElement"
      class="block font-mono text-sm leading-relaxed whitespace-pre-wrap !p-0"
      /></pre>
    </div>
  </div>
</template>