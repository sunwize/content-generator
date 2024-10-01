<script lang="ts" setup>
import { css } from "~/stores";
</script>

<template>
  <div>
    <CodeEditor
      v-model="css"
      language="css"
    />
  </div>
</template>