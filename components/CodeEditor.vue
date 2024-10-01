<script lang="ts" setup>
import hljs from "highlight.js";

import PhBroom from "~icons/ph/broom";
import PhCopy from "~icons/ph/copy";

type Props = {
  language: string;
  lines?: number;
};

const props = defineProps<Props>();

const modelValue = defineModel<string>({ required: true });
const wrapper = ref<HTMLElement>();
const codeElement = ref<HTMLElement>();
const tooltip = ref("Copy to clipboard");
const style = computed(() => ({
    height: `${props.lines ?? 20}rem`,
}));

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

const onScroll = (event: Event) => {
    if (!wrapper.value) return;

    const el = event.target as HTMLTextAreaElement;
    wrapper.value.style.transform = `translate(-${el.scrollLeft}px, -${el.scrollTop}px)`;
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
      <div class="flex items-center gap-4">
        <UTooltip
          text="Clear code"
          :popper="{ placement: 'top' }"
        >
          <UButton
            variant="ghost"
            color="gray"
            class="p-0"
            @click="modelValue = ''"
          >
            <PhBroom />
          </UButton>
        </UTooltip>

        <UTooltip
          :text="tooltip"
          :popper="{ placement: 'top' }"
        >
          <UButton
            variant="ghost"
            color="gray"
            class="p-0"
            @click="copyToClipboard"
          >
            <PhCopy />
          </UButton>
        </UTooltip>
      </div>
    </div>
    <div
      class="relative bg-slate-900 rounded-b-lg overflow-hidden px-3 py-2"
      :style="style"
    >
      <textarea
        v-model="modelValue"
        spellcheck="false"
        class="absolute inset-0 px-3 py-2 z-[1] overflow-auto whitespace-pre resize-none outline-none font-mono bg-transparent text-white/0 caret-white/80 text-sm leading-relaxed"
        :style="style"
        @scroll="onScroll"
      />
      <pre
        ref="wrapper"
        class="relative z-0"
      ><code
      ref="codeElement"
      class="block font-mono text-sm leading-relaxed whitespace-pre !p-0"
      /></pre>
    </div>
  </div>
</template>
