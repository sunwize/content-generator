<script lang="ts" setup>
import { minifyCode } from "~/assets/utils/formatter";
import { completedSteps, css, html, steps } from "~/stores";
import SolarPlayLinear from "~icons/solar/play-linear";

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

const generateSteps = () => {
    steps.value = [];
    steps.value.push({
        filename: "index.html",
        code: minifyCode(html.value),
        language: "xml",
    });
    const selectors = extractSelectorDefinitions(css.value);
    steps.value.push(...selectors.map((selector) => ({
        filename: "styles.css",
        code: minifyCode(selector),
        language: "css",
    })));

    completedSteps.value = [];
};
</script>

<template>
  <ul class="bg-slate-900 rounded-xl flex items-center justify-center gap-3 px-3 py-2">
    <li>
      <UButton
        variant="ghost"
        size="lg"
        @click="generateSteps"
      >
        <SolarPlayLinear class="size-6" />
      </UButton>
    </li>
  </ul>
</template>