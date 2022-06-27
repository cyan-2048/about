<script context="module">
import Calculator, { metadata as props0 } from "./Calculator.svelte";
import PhotoViewer, { metadata as props1 } from "./PhotoViewer.svelte";
import Traits, { metadata as props2 } from "./Traits.svelte";
import WindowCreator, { metadata as props3 } from "./WindowCreator.svelte";

export const apps = {
  Calculator: {
  ...props0,
  exec: Calculator,
},
  PhotoViewer: {
  ...props1,
  exec: PhotoViewer,
},
  Traits: {
  ...props2,
  exec: Traits,
},
  WindowCreator: {
  ...props3,
  exec: WindowCreator,
},
};
</script>