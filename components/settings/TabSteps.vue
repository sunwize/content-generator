<script lang="ts" setup>
import CodeEditor from "~/components/CodeEditor.vue";
import { includedSteps, steps } from "~/stores";
</script>

<template>
  <UCard>
    <ul class="grid grid-cols-1 gap-3">
      <li
        v-for="(step, index) in steps"
        :key="index"
        class="flex items-start gap-3"
      >
        <UCheckbox
          v-model="includedSteps[index]"
          class="mb-1"
        />
        <div class="flex-1 overflow-hidden">
          <CodeEditor
            v-model="step.code"
            :language="step.language"
            :lines="5"
          />
        </div>
      </li>
    </ul>
  </UCard>
</template>