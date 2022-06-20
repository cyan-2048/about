<script context="module">
import PhotoViewer, { metadata as props0 } from "./PhotoViewer.svelte";
import WindowCreator, { metadata as props1 } from "./WindowCreator.svelte";

export const apps = {
  PhotoViewer: {
  ...props0,
  exec: PhotoViewer,
},
  WindowCreator: {
  ...props1,
  exec: WindowCreator,
},
};
</script>