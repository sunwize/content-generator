import { formatCode } from "~/assets/utils/formatter";
import type { TutorialStep } from "~/types/TutorialStep";

export const html = ref(`
  <button>Button</button>
`);
export const css = ref(`
button {
  font-size: 1.5rem;
  color: #fafafa;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 10px;
  border: 2px solid #fafafa;
  background: #252525;
  box-shadow: 3px 3px #fafafa;
  cursor: pointer;
  margin: 35px 0;
}

button:active {
  box-shadow: none;
  transform: translate(3px, 3px);
}
`);

export const title = ref("Enter title");
export const scale = ref(100);
export const translateY = ref(0);
export const typingSpeed = ref(5);

export const renderStepIndex = ref(0);
export const stepIndex = ref(0);
export const steps = ref<TutorialStep[]>([]);
export const includedSteps = ref<boolean[]>([]);

export const isPlaying = ref(false);
export const isPreview = ref(false);
export const isPreviewCode = ref(false);

const extractSelectorDefinitions = (cssBlock: string) => {
    // Remove comments and trim the input
    const cleanCss = cssBlock.replace(/\/\*[\s\S]*?\*\//g, "").trim();

    // Match all CSS rules, including @rules like @keyframes and standard selectors
    const selectorRegex = /([^{]+\{(?:[^{}]*|\{[^}]*\})*\})/g;
    let match;
    const selectorDefinitions = [];

    while ((match = selectorRegex.exec(cleanCss)) !== null) {
        // Add the entire block (selector or @rule)
        selectorDefinitions.push(match[1].trim());
    }

    return selectorDefinitions;
};

export const generateSteps = async () => {
    steps.value = [];
    steps.value.push({
        filename: "index.html",
        code: await formatCode(html.value, "html"),
        language: "html",
    });
    const selectors = extractSelectorDefinitions(css.value);
    for (const selector of selectors) {
        steps.value.push({
            filename: "styles.css",
            code: await formatCode(selector, "css"),
            language: "css",
        });
    }

    includedSteps.value = steps.value.map(() => true);
};