<script lang="ts" setup>
import { done } from "~/assets/utils/sound";
import BackgroundVideo from "~/components/BackgroundVideo.vue";
import LiveEditor from "~/components/LiveEditor.vue";
import Sandbox from "~/components/Sandbox.vue";
import { html, includedSteps, isPlaying, isPreview, isPreviewCode, renderStepIndex, stepIndex, steps, title } from "~/stores";

const currentStep = computed(() => steps.value[stepIndex.value]);

// Only animate the first step
const animate = computed(() => stepIndex.value === includedSteps.value.findIndex((value) => value));

const nextStep = () => {
    const nextIndex = includedSteps.value.findIndex((value, index) => value && stepIndex.value < index);
    renderStepIndex.value = nextIndex;

    if (nextIndex === -1) {
        renderStepIndex.value = steps.value.length;
        done.currentTime = 0;
        done.play();

        return;
    }

    setTimeout(() => {
        stepIndex.value = nextIndex;
    }, 1000);
};
</script>

<template>
  <div
    id="live-preview"
    class="relative flex flex-col w-full bg-slate-900 max-w-md aspect-[9/16] overflow-hidden pt-20 pb-28"
  >
    <!-- <div class="grid-background" /> -->
    <BackgroundVideo />
    <div class="shade-background" />
    <div class="relative flex-1 flex flex-col">
      <p
        v-if="isPreview"
        class="font-bold text-5xl text-center leading-snug my-6 px-12"
      >
        {{ title }}
      </p>
      <div
        v-if="isPreviewCode"
        class="relative z-10 px-12"
      >
        <LiveEditor
          filename="index.html"
          :code="html"
          language="html"
          :animate="false"
          preview
        />
      </div>
      <div
        v-if="currentStep && isPlaying"
        :key="stepIndex"
        class="relative z-10 px-12"
      >
        <LiveEditor
          :filename="currentStep.filename"
          :code="currentStep.code"
          :language="currentStep.language"
          :animate="animate"
          :preview="false"
          @step-done="nextStep"
        />
      </div>
      <div class="relative flex-1 flex items-center justify-center">
        <div
          v-show="isPlaying || isPreview"
          class="animate-open absolute inset-12 flex items-center justify-center border border-white/20 rounded-2xl bg-white/5 shadow-xl backdrop-blur-sm overflow-hidden"
        >
          <Sandbox :preview="isPreview" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 50px 50px;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  animation: scroll-grid 0.75s linear infinite;
  pointer-events: none;
}

@keyframes scroll-grid {
  from {
    background-position: 100px 0;
  }
  to {
    background-position: 100px 100px;
  }
}

.shade-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 80%);
  pointer-events: none;
}

@keyframes open {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

.animate-open {
  animation: open 300ms ease-in-out;
}
</style>