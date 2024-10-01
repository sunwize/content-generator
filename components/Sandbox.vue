<script lang="ts" setup>
import { formatCode } from "~/assets/utils/formatter";
import { completedSteps, scale, steps } from "~/stores";

type Props = {
    preview: boolean;
};

const props = defineProps<Props>();

const style = computed(() => ({
    transform: `scale(${scale.value}%)`,
}));

const generateSandbox = async () => {
    const sandbox = document.querySelector("#sandbox");

    if (!sandbox || completedSteps.value.length === 0) return;

    const div = sandbox.shadowRoot ?? sandbox.attachShadow({ mode: "open" });
    div.innerHTML = "";
    const htmlSteps = completedSteps.value.filter((step) => step.language === "html");

    for (const step of htmlSteps) {
        div.innerHTML += await formatCode(step.code, step.language);
    }

    const style = document.createElement("style");

    const cssSteps = completedSteps.value.filter((step) => step.language === "css");

    for (const step of cssSteps) {
        style.innerHTML += await formatCode(step.code, step.language);
    }

    div.appendChild(style);
};

const generatePreview = async () => {
    await nextTick(); // Make sure the DOM is updated

    const sandbox = document.querySelector("#preview");

    if (!sandbox || steps.value.length === 0) return;

    const div = sandbox.shadowRoot ?? sandbox.attachShadow({ mode: "open" });
    div.innerHTML = "";
    const htmlSteps = steps.value.filter((step) => step.language === "html");

    for (const step of htmlSteps) {
        div.innerHTML += await formatCode(step.code, step.language);
    }

    const style = document.createElement("style");

    const cssSteps = steps.value.filter((step) => step.language === "css");

    for (const step of cssSteps) {
        style.innerHTML += await formatCode(step.code, step.language);
    }

    div.appendChild(style);
};

watch(completedSteps, () => {
    generateSandbox();
}, { deep: true });

watch(() => props.preview, (value) => {
    if (value) {
        generatePreview();
    }
});

onMounted(() => {
    if (props.preview) {
        generatePreview();
    }
});
</script>

<template>
  <div
    v-if="preview"
    id="preview"
    :style="style"
  />
  <div
    v-else
    id="sandbox"
    :style="style"
  />
</template>