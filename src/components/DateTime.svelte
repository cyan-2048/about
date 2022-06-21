<script>
  import { onDestroy, onMount } from "svelte";
  import { repeatEvery } from "../lib/helper";
  import { production } from "../lib/stores";

  let text;

  onMount(() => {
    function getDateTime() {
      const date = new Date();
      !production && console.info("updating time...", date * 1);
      return (
        date.toLocaleTimeString("en-us", { minute: "numeric", hour: "numeric" }) +
        "\n" +
        date.toLocaleDateString("en-us")
      );
    }
    text = getDateTime();
    const repeater = repeatEvery(() => (text = getDateTime()), 60000);
    return () => repeater.stop();
  });
</script>

<main on:click>{text}</main>

<style>
  main {
    text-align: center;
    white-space: pre-wrap;
    font-size: 12px;
    color: #fff;
    line-height: 17px;
    padding-top: 2px;
    font-family: Segoe UI, sans-serif;
    margin: 0 6px;
    user-select: none;
  }
</style>
