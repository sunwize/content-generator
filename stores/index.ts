import * as csstree from "css-tree";
import { defineStore } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import { formatCode } from "~/assets/utils/formatter";
import type { TutorialStep } from "~/types/TutorialStep";

export const useStore = defineStore("store", () => {
    const html = ref("");
    const css = ref("");

    const title = ref("");
    const scale = ref(100);
    const translateY = ref(0);
    const typingSpeed = ref(3);

    const renderStepIndex = ref(0);
    const stepIndex = ref(0);
    const steps = ref<TutorialStep[]>([]);
    const includedSteps = ref<boolean[]>([]);

    const isPlaying = ref(false);
    const isPreview = ref(false);
    const isPreviewCode = ref(false);
    const isPreviewTitle = ref(false);
    const isRecording = ref(false);

    const extractSelectorDefinitions = (cssFileContent: string) => {
        const ast = csstree.parse(cssFileContent);
        const selectors: string[] = [];

        if (ast.type !== "StyleSheet") return [];

        ast.children.forEach((node) => {
            if (node.type === "Rule" || node.type === "Atrule") {
                const selectorString = csstree.generate(node);
                selectors.push(selectorString);
            }
        });

        return selectors;
    };

    const generateSteps = async () => {
        steps.value = [];
        steps.value.push({
            filename: "index.html",
            code: await formatCode(html.value, "html"),
            language: "html",
        });
        const selectors = extractSelectorDefinitions(css.value);

        // Put @keyframes at the beginning
        selectors.sort((a, b) => {
            if (a.startsWith("@keyframes")) {
                return -1;
            } else if (b.startsWith("@keyframes")) {
                return 1;
            } else {
                return 0;
            }
        });

        for (const selector of selectors) {
            steps.value.push({
                filename: "styles.css",
                code: await formatCode(selector, "css"),
                language: "css",
            });
        }

        includedSteps.value = steps.value.map(() => true);
    };

    return {
        html,
        css,

        title,
        scale,
        translateY,
        typingSpeed,

        renderStepIndex,
        stepIndex,
        steps,
        includedSteps,

        isPlaying,
        isPreview,
        isPreviewCode,
        isPreviewTitle,
        isRecording,

        generateSteps,
    };
}, {
    persist: {
        storage: {
            getItem: key => useCookie<string | null>(
                key,
                {
                    decode: decodeURIComponent,
                    readonly: true,
                },
            ).value,
            setItem: (key, value) => useCookie<string>(
                key,
                {
                    encode: encodeURIComponent,
                },
            ).value = value,
        },
    },
});