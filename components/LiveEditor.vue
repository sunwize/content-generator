<script lang="ts" setup>
import hljs from "highlight.js/lib/core";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";
import prettierHTML from "prettier/plugins/html";
import prettierCSS from "prettier/plugins/postcss";
import prettier from "prettier/standalone";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("css", css);
hljs.registerLanguage("xml", xml);

type Props = {
  filename: string;
  code: string;
  language: string;
};

type Emits = {
  (e: "step-done"): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formattedCode = ref("");
const codeBlockEl = ref<HTMLElement>();

let timeout: ReturnType<typeof setTimeout> | null = null;

const countLines = (str: string) => {
    const lines = str.split("\n");
    return lines.length;
};

const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
};

const minifyCode = (code: string) => {
    return code
        .replace(/\/\*[\s\S]*?\*\//g, "")  // Remove multi-line comments (/* */)
        .replace(/\/\/.*/g, "")            // Remove single-line comments (//)
        .replace(/\n\s*/g, "")             // Remove newlines and excess spaces
        .replace(/\s*{\s*/g, "{")          // Remove space before and after curly braces
        .replace(/\s*}\s*/g, "}")          // Remove space before and after closing curly braces
        .replace(/\s*;\s*/g, ";")          // Remove space before and after semicolons
        .replace(/\s*:\s*/g, ":")          // Remove space before and after colons
        .trim();                           // Remove leading and trailing spaces
};

const typeNextChar = async () => {
    if (!codeBlockEl.value) return;

    codeBlockEl.value.style.height = "5rem";

    formattedCode.value = await prettier.format(minifyCode(props.code), {
        parser: props.language === "xml" ? "html" : props.language,
        plugins: [prettierHTML, prettierCSS],
    });
    formattedCode.value = formattedCode.value.trim();

    let typedText = "";
    let index = 0;

    const _typeNextChar = () => {
        if (!codeBlockEl.value) return;

        if (index < formattedCode.value.length) {
            typedText += formattedCode.value[index];
            codeBlockEl.value.textContent = typedText;
            index++;

            delete codeBlockEl.value.dataset.highlighted;
            hljs.highlightElement(codeBlockEl.value);

            // timeout = setTimeout(_typeNextChar, randomNumber(30, 50));
            timeout = setTimeout(_typeNextChar, 0);
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
        :class="`font-mono text-xs h-0 transition-all ease-in-out duration-500 language-${language}`"
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
</style>