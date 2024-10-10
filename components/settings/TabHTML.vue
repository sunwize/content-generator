<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { useStore } from "~/stores";

const store = useStore();
const { html } = storeToRefs(useStore());
</script>

<template>
  <div>
    <CodeEditor
      v-model="html"
      language="html"
      @change="store.generateSteps"
    />
  </div>
</template>