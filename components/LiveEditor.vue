<script lang="ts" setup>
import hljs from "highlight.js/lib/core";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";

import { sleep } from "~/assets/utils/sleep";
import { keyboard, pop, whoosh } from "~/assets/utils/sound";
import { Typewriter } from "~/assets/utils/typewriter";
import { includedSteps, isPlaying, stepIndex, typingSpeed } from "~/stores";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("css", css);
hljs.registerLanguage("xml", xml);

type Props = {
  filename: string;
  code: string;
  language: string;
  animate: boolean;
  preview: boolean;
};

type Emits = {
  (e: "step-done"): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const codeBlockEl = ref<HTMLElement>();

let timeout: ReturnType<typeof setTimeout> | null = null;
let typewriter: Typewriter | null = null;

const highlightCode = () => {
    if (!codeBlockEl.value) return;

    delete codeBlockEl.value.dataset.highlighted;
    hljs.highlightElement(codeBlockEl.value);
};

const type = async () => {
    if (!codeBlockEl.value || props.preview) return;

    await sleep(150);
    await keyboard.play();
    await sleep(150);

    typewriter = new Typewriter(codeBlockEl.value, {
        typingSpeed: Math.round(100 / typingSpeed.value),
        onCharacterTyped: () => {
            highlightCode();
            codeBlockEl.value?.scrollTo({
                top: codeBlockEl.value.scrollHeight,
                behavior: "smooth",
            });
        },
    })
        .typeString(props.code);

    typewriter.start()
        .then(() => {
            keyboard.pause();

            if (stepIndex.value === includedSteps.value.indexOf(true) && isPlaying.value) {
                pop.currentTime = 0;
                pop.play();
            }

            emit("step-done");
        });
};

onMounted(() => {
    if (props.animate) {
        whoosh.currentTime = 0;
        whoosh.play();
    }

    if (props.preview && codeBlockEl.value) {
        codeBlockEl.value.textContent = props.code;
        highlightCode();
    }

    type();
});

onBeforeUnmount(() => {
    typewriter?.cancel();
    if (timeout) {
        clearTimeout(timeout);
    }
});
</script>

<template>
  <div
    class="relative border border-white/20 rounded-2xl bg-slate-800/50 shadow-xl backdrop-blur-xl pt-3 pb-1"
    :class="[animate && 'fly']"
  >
    <div class="flex items-center mb-3">
      <div class="flex items-center gap-1.5 px-4">
        <div class="size-3 bg-red-500 rounded-full" />
        <div class="size-3 bg-yellow-500 rounded-full" />
        <div class="size-3 bg-green-500 rounded-full" />
      </div>
      <div class="flex-1 text-center text-white/80 text-xs mx-auto">
        {{ props.filename }}
      </div>
      <div class="w-[80px]" />
    </div>
    <div class="bg-slate-900/50 rounded-xl mx-1 px-4 py-3">
      <div
        id="code"
        ref="codeBlockEl"
        class="font-mono text-sm h-[10rem] transition-all ease-in-out duration-500"
        :class="[`language-${language}`, animate && 'h-expand']"
      />
    </div>
    <p class="font-mono text-xs text-gray-400 absolute right-2 -bottom-5">
      @ZeroToCommit
    </p>
  </div>
</template>

<style scoped>
:global(.hljs) {
  background: transparent;
}

#code {
  white-space: pre-wrap;
  line-break: anywhere;
  overflow: auto;
  scroll-behavior: smooth;
}

#code:after {
  content: "|";
  color: white;
  position: relative;
  animation: blink 500ms linear infinite alternate;
  display: inline-block;
  left: -4px;
  top: -1px;
  font-family: monospace;
  line-height: 1rem;
  font-size: 1.1rem;
}

#code::-webkit-scrollbar {
    display: none;
}

@keyframes blink {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
}

@keyframes h-expand {
    0% {
      height: 0;
    }
    100% {
      height: 10rem;
    }
}

.h-expand {
    animation: h-expand 300ms ease-in-out;
}

@keyframes fly {
    0% {
      opacity: 0;
      transform: translateY(100px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
}

.fly {
    animation: fly 300ms ease-in-out;
}

@keyframes open {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

.animate-open {
  animation: open 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>