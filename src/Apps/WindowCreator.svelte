<script context="module">
  export const metadata = {
    name: "window_creator",
    props: { buttons: "close", min: { height: 225, width: 228 } },
  };
</script>

<script>
  import { hashCode } from "../lib/helper";
  import { createEventDispatcher, onMount } from "svelte";
  import JSON5 from "json5";

  export let window;
  export const id = hashCode(String(Math.random()));
  const dispatch = createEventDispatcher();

  function openWindow(props = {}) {
    dispatch("open-window", { ...props });
  }

  function tryJSON(string) {
    let final = null;
    try {
      final = JSON5.parse(string);
    } catch (e) {}
    return final;
  }

  let text = JSON5.stringify({ buttons: "close", title: "hewo it's me titulo", height: 225, width: 228 }, null, 2);
  $: toProps = tryJSON(text);

  let reactive = JSON5.stringify({});
  $: reactive && tryJSON(reactive) && dispatch("prop-update", tryJSON(reactive));
</script>

<div class="field-row-stacked" style="width: 200px">
  <label for={id}>set props in JSON5 format</label>
  <textarea bind:value={text} {id} rows="8" />
  <label for={id + "reactive"}>set reactive props in JSON5 format</label>
  <textarea bind:value={reactive} id={id + "reactive"} rows="8" />
</div>
<button on:click={() => openWindow(toProps || window)}>Open Another Window</button>
