<script context="module">
  export const metadata = {
    name: "traits",
    props: {
      title: "Tabs of Cyan's Traits",
      min: {
        height: 317,
        width: 400,
      },
      height: 317,
      width: 400,
      snappable: true,
    },
  };

  const tabs = ["A", "B", "C", "D"];
  // using the module context, the compiler would treat it as not reactive,
  // might be useful for discord4kaios because kaios slow
</script>

<script>
  let selected = 0;
</script>

<section class="tabs">
  <menu role="tablist">
    {#each tabs as label, i}
      <button role="tab" on:click={() => (selected = i)} aria-selected={selected === i || null}>{label}</button>
    {/each}
  </menu>
  {#if selected == 0}
    <article role="tabpanel" id="tab-A">Tab A is active</article>
  {:else if selected == 1}
    <article role="tabpanel" id="tab-B" hidden>Tab B is active</article>
  {:else if selected == 2}<article role="tabpanel" id="tab-C" hidden>Tab C is active</article>
  {:else if selected == 3}
    <article role="tabpanel" id="tab-D" hidden>Tab D is inactive</article>
  {/if}
</section>
