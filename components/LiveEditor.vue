<script lang="ts" setup>
import hljs from "highlight.js/lib/core";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";

import { keyboard, whoosh } from "~/assets/utils/sound";
import { isPlaying } from "~/stores";

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

const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
};

const highlightCode = () => {
    if (!codeBlockEl.value) return;

    delete codeBlockEl.value.dataset.highlighted;
    hljs.highlightElement(codeBlockEl.value);
};

const typeNextChar = () => {
    if (!codeBlockEl.value || props.preview) return;

    let typedText = "";
    let index = 0;

    const _typeNextChar = () => {
        if (!codeBlockEl.value) return;

        if (index < props.code.length) {
            typedText += props.code[index];
            codeBlockEl.value.textContent = typedText;
            index++;

            highlightCode();

            timeout = setTimeout(_typeNextChar, randomNumber(30, 50));
            // timeout = setTimeout(_typeNextChar, 0);
        } else {
            keyboard.pause();
            emit("step-done");
        }

        codeBlockEl.value.scrollTo({
            top: codeBlockEl.value.scrollHeight,
            behavior: "smooth",
        });
    };

    setTimeout(() => {
        if (!isPlaying.value) return;

        _typeNextChar();
        keyboard.play();
    }, 500); // Wait for the initial animation to finish
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

    setTimeout(typeNextChar, 500);
});

onBeforeUnmount(() => {
    if (timeout) {
        clearTimeout(timeout);
    }
});
</script>

<template>
  <div
    class="ring-1 ring-white/20 rounded-2xl bg-slate-800 shadow-xl pt-3 pb-1"
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
    <div class="bg-slate-900 rounded-2xl mx-1 px-4 py-3">
      <div
        id="code"
        ref="codeBlockEl"
        class="font-mono text-xs h-[5rem] transition-all ease-in-out duration-500"
        :class="[`language-${language}`, animate && 'h-expand']"
      />
    </div>
  </div>
</template>

<style scoped>
:global(.hljs) {
  background: transparent;
}

#code {
  white-space: pre-wrap;
  overflow: auto;
  scroll-behavior: smooth;
}

#code:after {
  content: "|";
  color: white;
  position: relative;
  animation: blink 500ms linear infinite alternate;
  display: inline-block;
  transform: scaleY(1.3);
  left: -2px;
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
      height: 5rem;
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
</style>