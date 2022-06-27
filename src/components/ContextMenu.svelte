<script>
  import xy from "../lib/xy";
  import { onMount } from "svelte";
  export let contextmenu;
  let el, overflow;
  onMount(() => {
    const { x, y } = xy();
    const el_height = el.offsetHeight;
    const el_width = el.offsetWidth;
    let top = y,
      left = x;
    if (y > window.innerHeight - el_height) {
      top = y - el_height;
    }
    if (x > window.innerWidth - el_width) {
      left = x - el_width;
      overflow = true;
    }
    Object.assign(el.style, {
      top: top + "px",
      left: left + "px",
    });
  });
</script>

<ul bind:this={el} class:overflow role="menu" class="main can-hover" style="width: 200px;">
  <li role="menuitem" aria-haspopup="true">View</li>
  <li role="menuitem" aria-haspopup="true">
    Sort by
    <ul role="menu">
      <li role="menuitem"><a>Name</a></li>
      <li role="menuitem"><a>Size</a></li>
      <li role="menuitem"><a>Item type</a></li>
      <li role="menuitem" aria-haspopup="true">
        Date modified
        <ul role="menu">
          <li role="menuitem"><a>Name</a></li>
          <li role="menuitem"><a>Size</a></li>
          <li role="menuitem"><a>Item type</a></li>
        </ul>
      </li>
    </ul>
  </li>
  <li role="menuitem" class="has-divider"><a>Refresh</a></li>
  <li role="menuitem"><a>Paste</a></li>
  <li role="menuitem" class="has-divider"><a>Paste shortcut</a></li>
  <li role="menuitem">
    <img src="https://img.icons8.com/color/18/000000/monitor--v1.png" />
    <a>Screen resolution</a>
  </li>
  <li role="menuitem">
    <img src="https://img.icons8.com/color/18/000000/virtual-machine2.png" />
    <a>Gadgets</a>
  </li>
  <li role="menuitem">
    <img src="https://img.icons8.com/color/18/000000/remote-desktop.png" />
    <a>Personalize</a>
  </li>
</ul>

<style>
  * {
    user-select: none;
  }
  ul[role="menu"].overflow [role="menuitem"] > [role="menu"] {
    left: unset;
    right: 100%;
  }

  ul {
    cursor: url(./cursor/aero_arrow.png), auto;
  }
  .main {
    position: fixed;
    z-index: 96969696;
  }
</style>
