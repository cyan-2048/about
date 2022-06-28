<script>
  import { onMount } from "svelte";
  import { production } from "../lib/stores";
  import j from "../lib/jquery.js";
  export let taskbarWindow, contextmenu;

  let main;

  onMount(() => {
    j(main).selectable({
      appendTo: main,
      delay: 200,
      filter: "data-file",
    });
  });
</script>

<main
  on:contextmenu={() => (contextmenu = [])}
  bind:this={main}
  on:pointerdown={() => {
    taskbarWindow && (taskbarWindow = null);
    contextmenu && (contextmenu = null);
  }}
  on:dblclick={() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }}
  on:dragover={function (e) {
    e.preventDefault();
  }}
  on:drop={function (ev) {
    console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === "file") {
          const file = ev.dataTransfer.items[i].getAsFile();
          console.log("... file[" + i + "] ===", file);
        } else {
          console.log("different kind!", ev.dataTransfer.items[i]);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log("... file[" + i + "] ===", ev.dataTransfer.files[i]);
      }
    }
  }}
>
  {#if !production}
    <!-- svelte-ignore missing-declaration -->
    <div class="devbuild">Windows Developer Preview<br />Evaluation copy. Build {APP_VERSION}</div>
  {/if}
</main>

<style>
  .devbuild {
    position: absolute;
    right: 4px;
    text-align: right;
    font-size: 13px;
    color: white;
    bottom: 0;
    user-select: none;
  }
  main {
    position: fixed;
    z-index: 0;
    width: 100vw;
    height: calc(100vh - 40px);
    top: 0;
    left: 0;
  }
</style>
