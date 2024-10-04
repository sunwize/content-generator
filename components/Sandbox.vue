<script lang="ts" setup>
import { formatCode } from "~/assets/utils/formatter";
import { renderStepIndex, scale, steps, translateY } from "~/stores";
import type { TutorialStep } from "~/types/TutorialStep";

type Props = {
    preview: boolean;
};

const props = defineProps<Props>();

const style = computed(() => ({
    transform: `scale(${scale.value}%) translateZ(0) translateY(${translateY.value}px)`,
}));

const generateCode = async (steps: TutorialStep[], selector: string) => {
    await nextTick();

    const sandbox = document.querySelector(selector);

    if (!sandbox) return;

    const div = sandbox.shadowRoot ?? sandbox.attachShadow({ mode: "open" });
    div.innerHTML = "";
    const htmlSteps = steps.filter((step) => step.language === "html");

    for (const step of htmlSteps) {
        div.innerHTML += await formatCode(step.code, step.language);
    }

    const style = document.createElement("style");

    const cssSteps = steps.filter((step) => step.language === "css");

    for (const step of cssSteps) {
        style.innerHTML += await formatCode(step.code, step.language);
    }

    div.appendChild(style);
};

const generateSandbox = async () => {
    if (renderStepIndex.value <= 0) return;

    const completedSteps = steps.value.filter((_, index) => index < renderStepIndex.value);

    await generateCode(completedSteps, "#sandbox");
};

const generatePreview = async () => {
    await generateCode(steps.value, "#preview");
};

watch(renderStepIndex, () => {
    generateSandbox();
});

watch(() => props.preview, (value) => {
    if (value) {
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