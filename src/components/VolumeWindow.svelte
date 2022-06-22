<script context="module">
  let mounted = false;
  let setWave = () => {};

  function changeMountState(state, waveFunc = () => {}) {
    setWave = waveFunc;
    return (mounted = state);
  }

  function filterData(audioBuffer, duration) {
    const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
    const samples = toFixedNumber(duration) / 0.01; // Number of samples we want to have in our final data set
    const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
      }
      filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
    }
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map((n) => n * multiplier * 100);
  }

  const cachedData = {};
  async function getAudioContext(src, duration) {
    // if (cachedData[src]) return cachedData[src];
    const res = await fetch(src);
    const buffer = await res.arrayBuffer();
    const audioBuffer = await new AudioContext().decodeAudioData(buffer);
    return (cachedData[src] = filterData(audioBuffer, duration));
  }

  export async function setContext(audio) {
    if (!(audio instanceof Audio) || !mounted) return;
    const data = await getAudioContext(audio.src, audio.duration);

    let index = toFixedNumber(audio.currentTime) / 0.01;

    function wave() {
      const sync = toFixedNumber(audio.currentTime / 0.01) - index;
      if (sync > 40 || sync < -40) index = toFixedNumber(audio.currentTime) / 0.01;
      if (!audio.paused && data[index]) {
        index++;
        setWave(data[index] + "%");
        setTimeout(wave, 10);
      } else {
        setWave(null);
      }
    }

    if (!audio.paused) wave();
    else
      audio.addEventListener("playing", function end() {
        wave();
        audio.removeEventListener("playing", end);
      });
  }
</script>

<script>
  import Window from "./Window.svelte";
  import audios from "../lib/preload-audio";
  import { onMount } from "svelte";
  import { toFixedNumber } from "../lib/helper";

  export let volume;
  let wave = null;

  const props = {
    focused: true,
    draggable: false,
    noTitleBar: true,
    zIndex: 9999,
    resizable: false,
    width: 84,
    height: 305,
    animateMount: false,
    top: "unset",
    left: "unset",
    style: "right:52px; bottom: 50px;",
    noPadding: true,
  };
  let initial;

  function setWave(number) {
    wave = number;
  }

  onMount(() => {
    changeMountState(true, setWave);
    return () => {
      changeMountState(false);
    };
  });
</script>

<Window {...props}>
  <main>
    <img src="./volume/background.png" alt />
    <div id="bar" style:--wave={wave}>
      <div style:opacity={volume === null ? 0 : null} style:height={(volume || 0) * 100 + "%"} class="bar" />
      <div class="bar" />
    </div>
    <div id="slider" class="is-vertical">
      <input
        on:input={function () {
          initial = volume = this.value / 100;
        }}
        type="range"
        min="0"
        max="100"
        value="100"
        on:change={async function () {
          const audio = new window.Audio((await audios).ding);
          audio.volume = volume;
          await audio.play();
          setContext(audio);
        }}
      />
    </div>
    <button
      on:click={() => {
        if (volume === null) {
          volume = initial;
          return;
        }
        initial = volume;
        volume = null;
      }}
      data-muted={volume === null ? "" : null}
    />
  </main>
</Window>

<style>
  #bar {
    position: absolute;
    height: 115px;
    width: 3px;
    top: 75px;
    left: 31px;
    white-space: nowrap;
    --wave: 0;
  }
  #bar .bar {
    display: inline-block;
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
  }
  #bar .bar:first-child::after {
    color: rgb(51, 194, 51);
    z-index: 1;
  }
  #bar .bar:last-child::after {
    color: rgb(195, 197, 197);
  }
  #bar .bar::after {
    content: "";
    display: block;
    background: currentColor;
    width: 100%;
    height: var(--wave);
    position: absolute;
    bottom: 0;
    transition: height linear 0.07s;
  }

  #slider input {
    width: 122px;
  }
  #slider input::-moz-range-track,
  #slider input::-webkit-slider-runnable-track,
  #slider input::-webkit-scrollbar-corner {
    -webkit-appearance: none;
    background: transparent;
    box-shadow: none;
  }
  #slider input::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    width: 20px;
    height: 0px;
    background: rgb(231, 234, 234);
  }
  #slider {
    position: absolute;
    top: 56px;
    left: 23px;
  }
  * {
    user-select: none;
  }
  img {
    pointer-events: none;
  }
  button {
    all: revert;
    width: 32px;
    height: 30px;
    position: absolute;
    bottom: 68px;
    right: 25px;
    background-color: white;
    border: none;
  }
  button:hover {
    background-image: url("./volume/button_hover.png");
  }
  button:active {
    box-shadow: unset;
    outline: none;
    background-image: url("./volume/button_click.png");
  }
  button::before {
    content: "";
    position: absolute;
    background-image: url("./volume/no-sound.png");
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  button:not([data-muted])::before {
    background-image: url("./volume/sound.png");
  }
</style>
