<script lang="ts" setup>
import { html } from "~/stores";
</script>

<template>
  <div>
    <CodeEditor
      v-model="html"
      language="html"
    />
  </div>
</template>