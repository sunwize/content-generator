<script lang="ts" setup>
import NotoV1Gear from "~icons/noto-v1/gear";
import SkillIconsCss from "~icons/skill-icons/css";
import SkillIconsHtml from "~icons/skill-icons/html";
import TwemojiChequeredFlag from "~icons/twemoji/chequered-flag";

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
    {
        label: "Steps",
    },
];

const tabComponents: Record<string, ReturnType<typeof defineAsyncComponent>> = {
    HTML: defineAsyncComponent(() => import("./TabHTML.vue")),
    CSS: defineAsyncComponent(() => import("./TabCSS.vue")),
    Settings: defineAsyncComponent(() => import("./TabConfig.vue")),
    Steps: defineAsyncComponent(() => import("./TabSteps.vue")),
};

const tabIcons: Record<string, unknown> = {
    HTML: SkillIconsHtml,
    CSS: SkillIconsCss,
    Settings: NotoV1Gear,
    Steps: TwemojiChequeredFlag,
};
</script>

<template>
  <div class="flex-1 flex flex-col bg-slate-900 shadow-xl rounded-xl px-6 py-5">
    <UTabs
      :items="tabItems"
      class="mb-3"
    >
      <template #default="{ item }">
        <div class="flex items-center gap-2">
          <component
            :is="tabIcons[item.label]"
            class="size-5"
          />
          <p class="text-lg font-medium">
            {{ item.label }}
          </p>
        </div>
      </template>
      <template #item="{ item }">
        <component
          :is="tabComponents[item.label]"
        />
      </template>
    </UTabs>
  </div>
</template>