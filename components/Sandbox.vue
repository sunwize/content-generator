<script lang="ts" setup>
import { formatCode } from "~/assets/utils/formatter";
import { completedSteps } from "~/stores";

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

watch(completedSteps, () => {
    generateSandbox();
}, { deep: true });
</script>

<template>
  <div id="sandbox" />
</template>