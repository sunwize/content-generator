import * as csstree from "css-tree";

import { formatCode } from "~/assets/utils/formatter";
import { useStorage } from "~/composables/useStorage";
import type { TutorialStep } from "~/types/TutorialStep";

export const html = useStorage("html", "");
export const css = useStorage("css", "");

export const title = useStorage("title", "");
export const scale = useStorage("scale", 100);
export const translateY = useStorage("translateY", 0);
export const typingSpeed = useStorage("typingSpeed", 3);

export const renderStepIndex = ref(0);
export const stepIndex = ref(0);
export const steps = ref<TutorialStep[]>([]);
export const includedSteps = ref<boolean[]>([]);

export const isPlaying = ref(false);
export const isPreview = ref(false);
export const isPreviewCode = ref(false);
export const isPreviewTitle = ref(false);
export const isRecording = ref(false);

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

export const generateSteps = async () => {
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