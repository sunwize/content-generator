<script lang="ts" setup>
import hljs from "highlight.js/lib/core";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("css", css);
hljs.registerLanguage("xml", xml);

type Props = {
  filename: string;
  code: string;
  language: string;
  animate: boolean;
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

const typeNextChar = async () => {
    if (!codeBlockEl.value) return;

    codeBlockEl.value.style.height = "5rem";

    let typedText = "";
    let index = 0;

    const _typeNextChar = () => {
        if (!codeBlockEl.value) return;

        if (index < props.code.length) {
            typedText += props.code[index];
            codeBlockEl.value.textContent = typedText;
            index++;

            delete codeBlockEl.value.dataset.highlighted;
            hljs.highlightElement(codeBlockEl.value);

            timeout = setTimeout(_typeNextChar, randomNumber(30, 50));
            // timeout = setTimeout(_typeNextChar, 0);
        } else {
            emit("step-done");
        }

        codeBlockEl.value.scrollTo({
            top: codeBlockEl.value.scrollHeight,
            behavior: "smooth",
        });
    };

    setTimeout(_typeNextChar, 500); // Wait for the initial animation to finish
};

onMounted(() => {
    typeNextChar();
});

onBeforeUnmount(() => {
    if (timeout) {
        clearTimeout(timeout);
    }
});
</script>

<template>
  <div class="ring-1 ring-white/20 rounded-2xl bg-slate-800 shadow-xl pt-3 pb-1">
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
        :class="[`font-mono text-xs transition-all ease-in-out duration-500 language-${language}`, animate && 'appear']"
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

@keyframes appear {
    0% {
      height: 0;
    }
    100% {
      height: 5rem;
    }
}

.appear {
    animation: appear 300ms ease-in-out;
}
</style>