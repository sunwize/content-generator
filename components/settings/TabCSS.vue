<script lang="ts" setup>
import { css, generateSteps } from "~/stores";
</script>

<template>
  <div>
    <CodeEditor
      v-model="css"
      language="css"
      @change="generateSteps"
    />
  </div>
</template>