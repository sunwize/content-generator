<script lang="ts" setup>
import { generateSteps, html } from "~/stores";
</script>

<template>
  <div>
    <CodeEditor
      v-model="html"
      language="html"
      @change="generateSteps"
    />
    <ClientOnly>
      <Recorder target-selector="#preview" />
    </ClientOnly>
  </div>
</template>