<script lang="ts" setup>
import { formatCode } from "~/assets/utils/formatter";
import { keyboard } from "~/assets/utils/sound";
import { completedSteps, css, html, isPlaying, isPreview, stepIndex, steps } from "~/stores";
import SolarEyeLinear from "~icons/solar/eye-linear";
import SolarPlayLinear from "~icons/solar/play-linear";
import SolarStopLinear from "~icons/solar/stop-linear";

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

const play = () => {
    generateSteps();
    isPlaying.value = true;
    isPreview.value = false;
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
    isPlaying.value = false;
};

const togglePreview = async () => {
    const newValue = !isPreview.value;

    if (newValue) {
        await generateSteps();
    }

    isPreview.value = newValue;
};
</script>

<template>
  <ul class="bg-slate-900 rounded-xl flex items-center justify-center gap-3 px-3 py-2">
    <li>
      <UButton
        v-if="!isPlaying"
        variant="ghost"
        size="lg"
        color="primary"
        @click="play"
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
    <li>
      <UButton
        color="gray"
        size="lg"
        :variant="isPreview ? 'solid' : 'ghost'"
        :disabled="isPlaying"
        @click="togglePreview"
      >
        <SolarEyeLinear class="size-6" />
      </UButton>
    </li>
  </ul>
</template>