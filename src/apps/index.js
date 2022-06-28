import Calculator, { metadata as props0 } from "./Calculator.svelte";
import PhotoViewer, { metadata as props1 } from "./PhotoViewer.svelte";
import Run, { metadata as props2 } from "./Run.svelte";
import Traits, { metadata as props3 } from "./Traits.svelte";
import WindowCreator, { metadata as props4 } from "./WindowCreator.svelte";

const apps = {  Calculator: {
  ...props0,
  exec: Calculator,
},
  PhotoViewer: {
  ...props1,
  exec: PhotoViewer,
},
  Run: {
  ...props2,
  exec: Run,
},
  Traits: {
  ...props3,
  exec: Traits,
},
  WindowCreator: {
  ...props4,
  exec: WindowCreator,
},};

export default apps;
