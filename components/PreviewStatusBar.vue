<script lang="ts" setup>
import { formatCode } from "~/assets/utils/formatter";
import { keyboard } from "~/assets/utils/sound";
import { completedSteps, css, html, stepIndex, steps } from "~/stores";
import SolarPlayLinear from "~icons/solar/play-linear";
import SolarStopLinear from "~icons/solar/stop-linear";

const currentStep = computed(() => steps.value[stepIndex.value]);

const extractSelectorDefinitions = (cssBlock: string) => {
    // Remove comments and trim the input
    const cleanCss = cssBlock.replace(/\/\*[\s\S]*?\*\//g, "").trim();

    // Match all CSS rules, including @rules like @keyframes and standard selectors
    const selectorRegex = /([^{]+\{(?:[^{}]*|\{[^}]*\})*\})/g;
    let match;
    const selectorDefinitions = [];

    while ((match = selectorRegex.exec(cleanCss)) !== null) {
    // Add the entire block (selector or @rule)
        selectorDefinitions.push(match[1].trim());
    }

    return selectorDefinitions;
};

const generateSteps = async () => {
    stepIndex.value = 0;
    completedSteps.value = [];
    steps.value = [];
    steps.value.push({
        filename: "index.html",
        code: await formatCode(html.value, "html"),
        language: "html",
    });
    const selectors = extractSelectorDefinitions(css.value);
    for (const selector of selectors) {
        steps.value.push({
            filename: "styles.css",
            code: await formatCode(selector, "css"),
            language: "css",
        });
    }
};

const stop = () => {
    stepIndex.value = 0;
    completedSteps.value = [];
    steps.value = [];

    keyboard.pause();
    keyboard.currentTime = 0;

    const sandbox = document.querySelector("#sandbox");

    if (sandbox?.shadowRoot) {
        sandbox.shadowRoot.innerHTML = "";
    }
};
</script>

<template>
  <ul class="bg-slate-900 rounded-xl flex items-center justify-center gap-3 px-3 py-2">
    <li>
      <UButton
        v-if="!currentStep"
        variant="ghost"
        size="lg"
        color="primary"
        @click="generateSteps"
      >
        <SolarPlayLinear class="size-6" />
      </UButton>
      <UButton
        v-else
        variant="ghost"
        size="lg"
        color="red"
        @click="stop"
      >
        <SolarStopLinear class="size-6" />
      </UButton>
    </li>
  </ul>
</template>