<script lang="ts" setup>
import hljs from "highlight.js";
import SimpleCodeEditor from "simple-code-editor";

type Props = {
  language: string;
};

const props = defineProps<Props>();

const modelValue = defineModel<string>({ required: true });

const wrapper = ref<HTMLElement>();

watch(modelValue, () => {
    if (!wrapper.value) return;
    const codeElement = wrapper.value.querySelector("code")!;
    const formattedCode = hljs.highlight(modelValue.value, { language: props.language }).value;
    codeElement.innerHTML = formattedCode;
});
</script>

<template>
  <div ref="wrapper">
    <ClientOnly>
      <SimpleCodeEditor
        v-model="modelValue"
        theme="atom-one-dark"
        :languages="[[language]]"
        width="100%"
        height="500px"
      />
    </ClientOnly>
  </div>
</template>