<script lang="ts" setup>
import CodeEditor from "~/components/CodeEditor.vue";
import { css, html } from "~/stores";
import SkillIconsCss from "~icons/skill-icons/css";
import SkillIconsHtml from "~icons/skill-icons/html";

const tabItems = [
    {
        label: "HTML",
    },
    {
        label: "CSS",
    },
];

html.value = html.value.trim();
css.value = css.value.trim();
</script>

<template>
  <div class="flex-1 flex flex-col bg-slate-900 shadow-xl rounded-xl px-6 py-5">
    <UTabs
      :items="tabItems"
      class="mb-3"
    >
      <template #default="{ item }">
        <div class="flex items-center gap-2">
          <SkillIconsHtml
            v-if="item.label === 'HTML'"
            class="size-5"
          />
          <SkillIconsCss v-else />
          <p class="text-xl font-bold">
            {{ item.label }}
          </p>
        </div>
      </template>
      <template #item="{ item }">
        <div v-if="item.label === 'HTML'">
          <CodeEditor
            v-model="html"
            language="html"
          />
        </div>
        <div v-else>
          <CodeEditor
            v-model="css"
            language="css"
          />
        </div>
      </template>
    </UTabs>
  </div>
</template>