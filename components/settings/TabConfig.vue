<script lang="ts" setup>
import { scale, translateY, typingSpeed } from "~/stores";
</script>

<template>
  <UCard>
    <UFormGroup
      label="Scale"
      class="w-80 mb-6"
    >
      <URange
        v-model="scale"
        :min="0"
        :max="200"
        :step="1"
      />
    </UFormGroup>
    <UFormGroup
      label="Translate Y"
      class="w-80 mb-6"
    >
      <URange
        v-model="translateY"
        :min="-200"
        :max="200"
        :step="1"
      />
    </UFormGroup>
    <UFormGroup
      :label="`Typing speed x${typingSpeed}`"
      class="w-80 mb-6"
    >
      <URange
        v-model="typingSpeed"
        :step="1"
        :min="1"
        :max="5"
      />
    </UFormGroup>
  </UCard>
</template>