<script>
  import { onMount } from "svelte";
  import { closest } from "../lib/helper";
  import { production } from "../lib/stores";
  import DateTime from "./DateTime.svelte";
  import DateWindow from "./DateWindow.svelte";
  import StartMenu from "./StartMenu.svelte";
  import VolumeWindow from "./VolumeWindow.svelte";
  import Window from "./Window.svelte";

  export let windows = [];
  export let volume;
  export let socials = null;

  let main,
    battery = null,
    charging = false;

  function siftWindows(windows) {}

  $: taskbarItems = windows;

  onMount(() => {
    let attempts = 0;
    async function getSocials() {
      if (!production) return;
      while (socials === null) {
        if (attempts === 10) break;
        try {
          const res = await fetch("https://website.cyan-2048.workers.dev/socials");
          socials = await res.json();
          await new Promise((res) => setTimeout(res, 1000));
        } catch (e) {}
        attempts++;
      }
    }
    getSocials();
  });

  onMount(async () => {
    function updateBattery(e) {
      const goal = e.level / 0.1;
      battery = closest([1, 2, 4, 6, 8, 10], goal);
      charging = e.charging;
    }
    if (navigator.getBattery) {
      const battery = await navigator.getBattery();
      updateBattery(battery);
      const cb = () => updateBattery(battery);
      battery.addEventListener("chargingchange", cb);
      battery.addEventListener("levelchange", cb);
    }
  });

  export let taskbarWindow = null;

  function toggle(toWindow) {
    if (taskbarWindow === toWindow) {
      taskbarWindow = null;
    } else taskbarWindow = toWindow;
  }

  function decideVol(value) {
    if (volume === null) return "mute";
    let vol = 3;
    if (value == 0) vol = 0;
    else if (value < 33) vol = 1;
    else if (value < 65) vol = 2;
    return vol;
  }
</script>

{#if taskbarWindow === "volume"}
  <VolumeWindow bind:volume />
{:else if taskbarWindow === "date"}
  <DateWindow />
{:else if taskbarWindow === "start"}
  <StartMenu {socials} />
{/if}
<main id="taskbar" bind:this={main}>
  <div on:click={() => toggle("start")} class:focused={taskbarWindow === "start"} id="start" />
  <div id="tray">
    {#if battery !== null}
      <div
        class="indicator"
        style:background-size="unset"
        style:background-image="url(./battery/{battery}{charging ? "-charging" : ""}.png)"
      />
    {/if}
    <div
      class="indicator"
      style:background-image="url(./network/{/Mobi/.test(navigator.userAgent) ? "wifi" : "lan"}-{Number(
        !!socials
      )}.ico)"
    />
    <div
      class="indicator"
      on:click={() => toggle("volume")}
      draggable="false"
      style:background-image="url(./volume/{decideVol(volume * 100)}.ico)"
    />
    <DateTime on:click={() => toggle("date")} />
    <button id="show_desktop" />
  </div>
</main>

<style>
  #tray > :global(.indicator) {
    width: 22px;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 16px;
    background-position: center;
  }
  #start {
    width: 53px;
    height: 40px;
    background-image: url("./start/start.png");
    position: relative;
  }
  #start::after,
  #start::before,
  #start {
    background-size: 58px;
    background-position-y: -9.6px;
    background-position-x: center;
  }
  #start::after,
  #start::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  #start::before {
    background-image: url("./start/start-hovered.png");
  }
  #start:hover::before,
  #start.focused::after {
    opacity: 1;
  }
  #start::after {
    background-image: url("./start/start-selected.png") !important;
  }
  #taskbar {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    height: 38px;
    border-top: solid 1px rgba(255, 255, 255, 0.5);
    box-shadow: 0 -1px 0 0 #222;
    z-index: 9999;
    backdrop-filter: blur(1.5px);
    background-color: rgba(0, 0, 0, 0.15);
  }
  #taskbar > * {
    margin-top: -1px;
  }
  #tray {
    position: absolute;
    right: 0;
    height: 100%;
    width: 160px;
    display: flex;
    justify-self: right;
    justify-content: right;
  }
  #show_desktop {
    width: 15px;
    height: 40px;
    background-image: url("aero_peek_sprite.webp") !important;
    background-position-x: 0px;
    background-repeat: no-repeat;
    overflow: hidden;
  }

  #show_desktop {
    outline: none !important;
    border-radius: 0px !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    min-width: 0 !important;
    min-height: 0 !important;
    box-shadow: none !important;
    background-image: none;
  }

  #show_desktop:hover {
    background-position-x: -15px;
  }
  #show_desktop:active {
    background-position-x: -30px;
  }
</style>
