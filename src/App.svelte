<script>
  import "7.css/dist/7.css";
  import "./assets/reset.css";
  import "./assets/cursors.css";
  import "./assets/global.css";
  import DWM from "./components/DWM.svelte";

  let wallpaper = "/wallpaper.webp";
  $: wallpaper && document.body.style.setProperty("--wallpaper", `url(${wallpaper})`);
</script>

<DWM />

<svelte:window on:contextmenu={() => false} />
