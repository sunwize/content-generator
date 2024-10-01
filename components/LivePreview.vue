<script lang="ts" setup>
import LiveEditor from "~/components/LiveEditor.vue";
import Sandbox from "~/components/Sandbox.vue";
import { completedSteps, stepIndex, steps, title } from "~/stores";

const currentStep = computed(() => steps.value[stepIndex.value]);

const nextStep = () => {
    completedSteps.value.push(currentStep.value);
    if (stepIndex.value < steps.value.length - 1) {
        setTimeout(() => {
            stepIndex.value++;
        }, 1000);
    }
};
</script>

<template>
  <div class="relative flex flex-col w-full bg-slate-900 max-w-sm aspect-[9/16] overflow-hidden pt-20 pb-28">
    <div class="grid-background" />
    <div class="shade-background" />
    <div class="relative flex-1 flex flex-col">
      <p class="text-center text-3xl font-bold tracking-wide leading-snug px-3">
        {{ title }}
      </p>
      <div class="relative flex-1 flex items-center justify-center">
        <div class="absolute inset-12 flex items-center justify-center">
          <Sandbox />
        </div>
      </div>
      <div
        v-if="currentStep"
        :key="stepIndex"
        class="px-3"
      >
        <LiveEditor
          :filename="currentStep.filename"
          :code="currentStep.code"
          :language="currentStep.language"
          :animate="stepIndex === 0"
          @step-done="nextStep"
        />
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
  animation: scroll-grid 3s linear infinite;
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
  background: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 80%);
  pointer-events: none;
}
</style>