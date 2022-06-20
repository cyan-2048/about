<script>
  import { hashCode } from "../lib/helper.js";
  import Window from "./Window.svelte";
  import { apps } from "../Apps/apps.svelte";
  import { production } from "../lib/stores.js";
  import Taskbar from "./Taskbar.svelte";

  console.log(apps);

  let windows = [];

  function randomString() {
    return hashCode(String(Math.random()));
  }

  function decideTopLeft(window) {
    if (window.program) {
    }
  }

  function getHighestZ() {
    return Math.max(...windows.map((o) => o.zIndex));
  }

  function runApp(name) {
    const zIndex = (windows[0] ? getHighestZ() : 0) + 1;
    windows = [...windows, { ...apps[name].props, zIndex, app: apps[name], id: randomString(), focused: true }];
  }

  runApp("WindowCreator");

  function zIndex(window) {
    !production && console.info("update zIndex");
    const len = windows.length;
    if (len === 1) return;
    const highest = getHighestZ();
    if (window.zIndex === highest) {
      if (!window.focused)
        windows = windows.map((item) => {
          if (item.id === window.id) return { ...item, focused: true };
          return { ...item, focused: null };
        });
      return;
    }
    windows = windows.map((item) => {
      if (item.id === window.id) return { ...item, zIndex: highest + 1, focused: true };
      return { ...item, focused: null };
    });
  }
</script>

{#each windows as window, i (window.id)}
  <Window
    on:close={function () {
      windows = windows.filter((a) => a.id !== window.id);
      const highest = getHighestZ();
      windows = windows.map((item) => {
        if (item.zIndex !== highest) return item;
        return { ...item, focused: true };
      });
    }}
    on:z-index={() => zIndex(window)}
    {...window}
  >
    {#if window.app}
      <svelte:component
        this={window.app.exec}
        {window}
        on:open-window={function ({ detail }) {
          windows = [...windows, { ...detail, zIndex: getHighestZ() + 1, id: randomString(), focused: null }];
        }}
      />
    {/if}
  </Window>
{/each}
<Taskbar {windows} />
