<script>
  // imports
  import j from "../lib/jquery.js";
  import { createEventDispatcher, onMount } from "svelte";
  import { production } from "../lib/stores.js";
  import SnapAnimation from "./SnapAnimation.svelte";
  import getClientXY from "../lib/xy.js";

  // defaults
  const default_buttons = ["Minimize", "Maximize", "Close"];
  const allButtons = [...default_buttons, "Restore"];

  // props
  export let id = null;
  export let buttons = default_buttons;
  export let title = "";
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
  export let focusedOnce = false;
  export let style = "";
  export let animateMount = true;
  export let animateDestroy = true;
  export let noPadding = false;
  export let snappable = false;
  export let noTitleBar = false;

  $: _min = { height: min_height, width: min_width, ...min }; // decide min

  const dispatch = createEventDispatcher();

  $: if (focusedOnce && !focused) {
    dispatch("close");
  }

  // elements
  let main,
    titlebar,
    btn_con,
    mounted = false;

  let t_height = 12;
  let b_con_width = 6;
  let cursor = null;

  let snapping = false;

  $: if (mounted && (draggable !== null || resizable !== null)) {
    const h = (e) => (e ? "enable" : "disable");
    if (j(main).draggable("instance")) j(main).draggable(h(draggable));
    if (j(main).resizable("instance")) j(main).resizable(h(resizable));
  }

  onMount(() => {
    dispatch("z-index");

    b_con_width = btn_con?.offsetWidth || 6;
    if (titlebar) t_height = titlebar.offsetHeight + 6;
    else t_height = 12;

    const { assign } = Object;

    const unpx = (e) => Number(e.slice(0, -2));
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

    function isInViewport(element) {
      return (
        element.offsetTop < window.innerHeight &&
        element.offsetTop > -element.offsetHeight &&
        element.offsetLeft > -element.offsetWidth &&
        element.offsetLeft < window.innerWidth
      );
    }

    function backToZero(stop) {
      if (!main) return;
      const { style } = main;

      if (unpx(style.top) < 0) style.top = 0;
      if (unpx(style.top) > window.innerHeight - 50) style.top = px(window.innerHeight - 68);
      if (unpx(style.left) < 0 && !isInViewport(main)) style.left = 0;
      if (unpx(style.left) > window.innerWidth && !isInViewport(main))
        style.left = px(window.innerWidth - main.offsetWidth);

      if (stop) {
        document.body.style.cursor = "url(./cursor/aero_arrow.png), auto";
      }
    }

    if (main) {
      if (resizable) {
        j(main).resizable({
          handles: "all",
          minWidth: _min.width,
          minHeight: _min.height,
          cursor: false,
          start() {
            !production && console.info("resize start");
            dispatch("z-index");
            backToZero();
          },
          stop() {
            !production && console.info("resize end");
            backToZero(true);
          },
        });
      }
    }

    function handleSnapping(top, left) {
      if (top < 10) {
        snapping = "top";
      } else if (left < 10) {
        snapping = "left";
      } else if (left > window.innerWidth - 10) {
        snapping = "right";
      } else snapping = false;
    }

    if (titlebar && draggable) {
      j(main).draggable({
        handle: titlebar,
        cursor: false,
        start() {
          !production && console.info("drag start");
        },
        drag() {
          if (snappable) {
            const [left, top] = getClientXY(true);
            if (!isNaN(top) && !isNaN(left)) handleSnapping(top, left);
          }
        },
        stop() {
          !production && console.info("drag stop");
          backToZero(true);
          if (snapping) snapping = false;
        },
      });
    }
    mounted = true;
    return () => {
      if (j(main).draggable("instance")) j(main).draggable("destroy");
      if (j(main).resizable("instance")) j(main).resizable("destroy");
    };
  });

  let closing = false;

  function onClose() {
    !production && console.info("window close:", id);
    if (!animateDestroy) return dispatch("close");
    closing = true;
    setTimeout(dispatch, 350, "close");
  }

  function decideButtons(lebuttons) {
    if (typeof lebuttons === "string") return [lebuttons];
    else if (lebuttons instanceof Array) return lebuttons;
    else return [];
  }
</script>

{#if snapping}
  <SnapAnimation direction={snapping} />
{/if}
<div
  data-focused={focused}
  bind:this={main}
  {id}
  class="window glass"
  class:cursor-working={cursor === "working"}
  class:cursor-busy={cursor === "busy"}
  class:closing
  class:animateMount
  {style}
  style:z-index={zIndex}
>
  {#if !noTitleBar}
    <div on:pointerdown={() => dispatch("z-index")} bind:this={titlebar} class="title-bar">
      <div style:padding-right="{b_con_width}px" class="title-bar-text">{String(title) || (draggable ? "​" : "")}</div>
      <div bind:this={btn_con} class="title-bar-controls">
        {#each decideButtons(buttons)
          .map((btn) => {
            if (!btn) return;
            const string = String(btn);
            const sift = allButtons.find((a) => a
                .toLocaleLowerCase()
                .includes(string.toLocaleLowerCase().replaceAll("!", "")));
            if (sift) {
              return { name: sift, disabled: string.includes("!") };
            }
          })
          .filter((a) => a) as { name, disabled }}
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
            {disabled}
          />
        {/each}
      </div>
    </div>{/if}
  <div
    on:pointerdown={() => dispatch("z-index")}
    style:--t_height="{t_height}px"
    class="window-body"
    style:padding={noPadding ? 0 : null}
  >
    <slot><p>There's so much room for activities! window.id: {id}</p></slot>
  </div>
</div>

<style>
  .title-bar-controls > button:disabled {
    pointer-events: none;
  }
  .title-bar-controls > button:disabled::before {
    opacity: 0.5;
  }
  .window:not([data-focused]) .title-bar-controls > button {
    background: transparent;
    box-shadow: unset;
  }
  .window:not([data-focused]) .title-bar-controls {
    background: transparent;
    border-color: rgba(0, 0, 0, 0.3);
  }

  .window::before,
  .title-bar {
    background: transparent !important;
  }
  .animateMount {
    animation: openwindow 0.3s ease;
  }
  .window {
    touch-action: none;
    position: absolute;
    overflow: hidden;
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
