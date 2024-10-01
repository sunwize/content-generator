<script lang="ts" setup>
import CodeEditor from "~/components/CodeEditor.vue";
import { css, html, scale, title } from "~/stores";
import SkillIconsCss from "~icons/skill-icons/css";
import SkillIconsHtml from "~icons/skill-icons/html";

const tabItems = [
    {
        label: "HTML",
    },
    {
        label: "CSS",
    },
    {
        label: "Settings",
    },
];
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
          <SkillIconsCss v-else-if="item.label === 'CSS'" />
          <p class="text-lg font-medium">
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
        <div v-else-if="item.label === 'CSS'">
          <CodeEditor
            v-model="css"
            language="css"
          />
        </div>
        <UCard v-else-if="item.label === 'Settings'">
          <UFormGroup
            label="Title"
            class="mb-6"
          >
            <UInput
              v-model="title"
              class="w-80"
            />
          </UFormGroup>
          <UFormGroup label="Scale">
            <URange
              v-model="scale"
              :min="0"
              :max="200"
            />
          </UFormGroup>
        </UCard>
      </template>
    </UTabs>
  </div>
</template>