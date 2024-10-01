<script lang="ts" setup>
import { scale, skipHTML, title } from "~/stores";
</script>

<template>
  <UCard>
    <UFormGroup
      label="Title"
      class="mb-6"
    >
      <UInput
        v-model="title"
        class="w-80"
      />
    </UFormGroup>
    <UFormGroup
      label="Scale"
      class="mb-6"
    >
      <URange
        v-model="scale"
        :min="0"
        :max="200"
      />
    </UFormGroup>
    <UCheckbox
      v-model="skipHTML"
      label="Skip HTML"
    />
  </UCard>
</template>