<script context="module">
  export const metadata = {
    name: "window_creator",
    props: { buttons: "close", min: { height: 225, width: 228 } },
  };
</script>

<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { hashCode } from "../lib/helper";

  export let window;
  const dispatch = createEventDispatcher();

  function openWindow(props = {}) {
    dispatch("open-window", { ...props });
  }

  function tryJSON(string) {
    let final = null;
    if (!string.startsWith("{")) return null;
    try {
      final = JSON.parse(string);
    } catch (e) {}
    return final;
  }

  let text = `{"buttons":"close", "title":"hewo it's me titulo","height":225,"width":228}`;
  $: toProps = tryJSON(text);
</script>

<div class="field-row-stacked" style="width: 200px">
  <label for="text24">set props in JSON format</label>
  <textarea bind:value={text} id="text24" rows="8" />
</div>
<button on:click={() => openWindow(toProps || window)}>Open Another Window</button>
