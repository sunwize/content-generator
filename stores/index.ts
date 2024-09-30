import type { TutorialStep } from "~/types/TutorialStep";

export const filename = ref("index.js");
export const title = ref("Status Window Indicator");
export const html = ref(`<div>
  <p id="prout">
    <button class="test">Button</button>
  </p>
</div>`);
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

export const steps = ref<TutorialStep[]>([]);
export const completedSteps = ref<TutorialStep[]>([]);