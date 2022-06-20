<script>
  // imports
  import j from "../lib/jquery.js";
  import { createEventDispatcher, onMount } from "svelte";
  import { production } from "../lib/stores.js";

  // defaults
  const default_buttons = ["Minimize", "Maximize", "Close"];
  const allButtons = [...default_buttons, "Restore"];

  // props
  export let id = null;
  export let buttons = default_buttons;
  export let title = null;
  export let min_height = 158;
  export let min_width = 158;
  export let min = {};
  export let height = null;
  export let width = null;
  export let zIndex = 1;
  export let top = 10;
  export let left = 10;
  export let resizable = true;
  export let draggable = true;
  export let focused = null;

  $: _min = { height: min_height, width: min_width, ...min }; // decide min

  const dispatch = createEventDispatcher();

  // elements
  let main, titlebar, btn_con;

  let t_height = 12;
  let b_con_width = 6;
  let cursor = null;

  onMount(() => {
    dispatch("z-index");

    b_con_width = btn_con?.offsetWidth || 6;
    if (titlebar) t_height = titlebar.offsetHeight + 6;
    else t_height = 12;

    const { assign } = Object;

    function px(num) {
      if (typeof num !== "number") return num;
      return num + "px";
    }

    assign(main.style, {
      top: px(top),
      left: px(left),
      height: px(height || "unset"),
      width: px(width || "unset"),
    });

    function backToZero(stop) {
      const { style } = main;
      if (Number(style.top.slice(0, -2)) < 0) style.top = 0;
      if (stop) {
        document.body.style.cursor = "url(/cursor/aero_arrow.png), auto";
      }
    }

    if (main) {
      if (resizable) {
        j(main).resizable({
          handles: "all",
          minWidth: _min.width,
          minHeight: _min.height,
          cursor: false,
          start: () => {
            !production && console.info("resize start");
            dispatch("z-index");
            backToZero();
          },
          stop: () => {
            !production && console.info("resize end");
            backToZero(true);
          },
        });
      }
    }

    if (titlebar && draggable) {
      j(main).draggable({
        handle: titlebar,
        cursor: false,
        start: () => {
          !production && console.info("drag start");
        },
        stop: () => {
          !production && console.info("drag stop");
          backToZero(true);
        },
      });
    }
    return () => {};
  });

  let closing = false;

  function onClose() {
    !production && console.info("window close:", id);
    closing = true;
    setTimeout(dispatch, 350, "close");
  }
</script>

<div
  data-focused={focused}
  bind:this={main}
  {id}
  class="window glass"
  class:cursor-working={cursor === "working"}
  class:cursor-busy={cursor === "busy"}
  class:closing
  style:z-index={zIndex}
>
  {#if title || buttons[0]}
    <div on:pointerdown={() => dispatch("z-index")} bind:this={titlebar} class="title-bar">
      <div style:padding-right="{b_con_width}px" class="title-bar-text">{title}</div>
      <div bind:this={btn_con} class="title-bar-controls">
        {#each [buttons]
          .flat()
          .map((btn) => allButtons.find((a) => {
              let lc = btn.toLocaleLowerCase();
              return a.toLocaleLowerCase().includes(lc);
            }))
          .filter((a) => a) as name (name)}
          <button
            on:click={function () {
              function onMinimize() {
                !production && console.info("window min:", id);
              }
              function onMaximize() {
                !production && console.info("window max:", id);
              }
              function onRestore() {
                !production && console.info("window res:", id);
              }
              [onMinimize, onMaximize, onClose, onRestore][allButtons.indexOf(name)]?.();
            }}
            aria-label={name}
          />
        {/each}
      </div>
    </div>
  {/if}
  <div
    on:pointerdown={() => dispatch("z-index")}
    on:close={onClose}
    style:--t_height="{t_height}px"
    class="window-body"
  >
    <slot><p>There's so much room for activities! window.id: {id}</p></slot>
  </div>
</div>

<style>
  .window::before,
  .title-bar {
    background: rgba(0, 0, 0, 0) !important;
  }
  .window {
    touch-action: none;
    position: absolute;
    overflow: hidden;
    animation: openwindow 0.3s ease;
  }
  .window-body {
    height: calc(100% - var(--t_height));
  }
  .window-body:first-child {
    margin-top: 6px;
  }
  .title-bar-controls {
    position: absolute;
    right: 6px;
    top: 0;
    margin-top: 0;
  }
  .title-bar-text {
    width: 100%;
    white-space: nowrap;
  }
  .title-bar {
    touch-action: none;
    display: block;
    user-select: none;
  }
  [data-focused] {
    box-shadow: 2px 2px 13px 0 rgba(0, 0, 0, 1);
  }

  .closing {
    animation: closewindow 0.3s cubic-bezier(0.86, 0, 0.07, 1) forwards !important;
  }

  @keyframes closewindow {
    from {
      transform: rotateX(0deg);
      opacity: 1;
    }
    to {
      transform: rotateX(-15deg) scale(0.9);
      opacity: 0;
    }
  }
  @keyframes openwindow {
    from {
      transform: rotateX(-15deg) scale(0.9);
      opacity: 0;
    }
    to {
      transform: rotateX(0deg);
      opacity: 1;
    }
  }
</style>
