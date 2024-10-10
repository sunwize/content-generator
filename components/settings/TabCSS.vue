<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { useStore } from "~/stores";

const store = useStore();
const { css } = storeToRefs(useStore());
</script>

<template>
  <div>
    <CodeEditor
      v-model="css"
      language="css"
      @change="store.generateSteps"
    />
  </div>
</template>