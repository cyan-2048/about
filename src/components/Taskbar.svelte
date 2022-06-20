<script>
  import { onMount } from "svelte";
  import { production } from "../lib/stores";

  export let windows = [];
  let main,
    socials = null;

  function siftWindows(windows) {}

  $: taskbarItems = windows;

  onMount(() => {
    async function getSocials() {
      if (!production) return;
      while (socials === null) {
        try {
          const res = await fetch("https://website.cyan-2048.workers.dev/socials");
          socials = await res.json();
        } catch (e) {}
      }
    }
    getSocials();
  });
</script>

<main bind:this={main} />

<style>
</style>
