<script lang="ts" setup>
import * as sounds from "~/assets/sounds";
import { includedSteps, isPlaying, isPreview, isPreviewCode, isPreviewTitle, renderStepIndex, stepIndex, steps } from "~/stores";
import SolarEyeLinear from "~icons/solar/eye-linear";
import SolarPlayLinear from "~icons/solar/play-linear";
import SolarProgrammingLinear from "~icons/solar/programming-linear";
import SolarStopLinear from "~icons/solar/stop-linear";
import SolarTextLinear from "~icons/solar/text-linear";

const play = () => {
    renderStepIndex.value = includedSteps.value.indexOf(true);
    stepIndex.value = renderStepIndex.value;

    isPlaying.value = true;
    isPreview.value = false;
    isPreviewCode.value = false;
    isPreviewTitle.value = false;
};

const stop = () => {
    renderStepIndex.value = 0;
    stepIndex.value = 0;

    Object.values(sounds)
        .filter((sound) => sound instanceof HTMLAudioElement)
        .forEach((sound) => {
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
  <ul class="flex flex-col gap-2">
    <li>
      <UTooltip
        v-if="!isPlaying"
        text="Play preview"
      >
        <UButton
          variant="ghost"
          color="primary"
          :disabled="steps.length === 0"
          @click="play"
        >
          <SolarPlayLinear class="size-6" />
        </UButton>
      </UTooltip>
      <UTooltip
        v-else
        text="Stop preview"
      >
        <UButton
          variant="ghost"
          color="red"
          @click="stop"
        >
          <SolarStopLinear class="size-6" />
        </UButton>
      </UTooltip>
    </li>
    <li>
      <UTooltip text="Show title">
        <UButton
          color="gray"
          :variant="isPreviewTitle ? 'solid' : 'ghost'"
          :disabled="isPlaying"
          @click="isPreviewTitle = !isPreviewTitle"
        >
          <SolarTextLinear class="size-6" />
        </UButton>
      </UTooltip>
    </li>
    <li>
      <UTooltip :text="isPreview ? 'Hide sandbox' : 'Show sandbox'">
        <UButton
          color="gray"
          :variant="isPreview ? 'solid' : 'ghost'"
          :disabled="isPlaying"
          @click="isPreview = !isPreview"
        >
          <SolarEyeLinear class="size-6" />
        </UButton>
      </UTooltip>
    </li>
    <li>
      <UTooltip :text="isPreviewCode ? 'Hide terminal' : 'Show terminal'">
        <UButton
          color="gray"
          :variant="isPreviewCode ? 'solid' : 'ghost'"
          :disabled="isPlaying"
          @click="isPreviewCode = !isPreviewCode"
        >
          <SolarProgrammingLinear class="size-6" />
        </UButton>
      </UTooltip>
    </li>
  </ul>
</template>