<script context="module">
  export const metadata = {
    name: "run",
    props: {
      isBright: true,
      top: 337,
      left: 8,
      buttons: "close",
      height: 210,
      width: 410,
      title: "Run",
      noPadding: true,
      resizable: false,
    },
  };
</script>

<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let showTooltip = true;
</script>

<div class="a">
  <!-- svelte-ignore a11y-missing-attribute -->
  <img src="./run.ico" />
  <p>Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.</p>
</div>
<div class="b">
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label>Open: </label>

  <input type="text" on:input|once={() => (showTooltip = false)} />
  {#if showTooltip}
    <div role="tooltip">ye this is not working it's not finished</div>
  {/if}
</div>
<footer>
  <button on:click={() => dispatch("close")}>OK</button>
  <button on:click={() => dispatch("close")}>Cancel</button>
  <button disabled>Browse...</button>
</footer>

<style>
  img {
    pointer-events: none;
  }
  *:not(input) {
    user-select: none;
  }
  label {
    position: relative;
    top: -10px;
  }
  input {
    width: 320px;
    margin-left: 18px;
    margin-bottom: 21px;
  }
  [role="tooltip"] {
    position: absolute;
    z-index: 100;
    left: 64px;
  }
  .a {
    display: flex;
    flex-flow: row;
  }
  .b {
    margin-left: 10px;
  }
  p {
    margin: 17px;
    margin-left: 19.5px;
  }
  img {
    width: 32px;
    height: 32px;
    margin-left: 12px;
    margin-top: 15px;
  }
  footer {
    height: 60px;
    text-align: right;
    margin: 0;
    border: none;
    line-height: 40px;
    background: #eee;
    box-shadow: inset 0 1px 3px #ddd;
  }
</style>
