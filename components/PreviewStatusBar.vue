<script lang="ts" setup>
import * as sounds from "~/assets/utils/sound";
import { includedSteps, isPlaying, isPreview, isPreviewCode, renderStepIndex, stepIndex, steps } from "~/stores";
import SolarEyeLinear from "~icons/solar/eye-linear";
import SolarPlayLinear from "~icons/solar/play-linear";
import SolarProgrammingLinear from "~icons/solar/programming-linear";
import SolarStopLinear from "~icons/solar/stop-linear";

const play = () => {
    renderStepIndex.value = includedSteps.value.indexOf(true);
    stepIndex.value = renderStepIndex.value;

    isPlaying.value = true;
    isPreview.value = false;
    isPreviewCode.value = false;
};

const stop = () => {
    renderStepIndex.value = 0;
    stepIndex.value = 0;

    Object.values(sounds).forEach((sound) => {
        sound.pause();
        sound.currentTime = 0;
    });

    const sandbox = document.querySelector("#sandbox");

    if (sandbox?.shadowRoot) {
        sandbox.shadowRoot.innerHTML = "";
    }

    isPlaying.value = false;
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
        :disabled="steps.length === 0"
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
        @click="isPreview = !isPreview"
      >
        <SolarEyeLinear class="size-6" />
      </UButton>
    </li>
    <li>
      <UButton
        color="gray"
        size="lg"
        :variant="isPreviewCode ? 'solid' : 'ghost'"
        :disabled="isPlaying"
        @click="isPreviewCode = !isPreviewCode"
      >
        <SolarProgrammingLinear class="size-6" />
      </UButton>
    </li>
  </ul>
</template>