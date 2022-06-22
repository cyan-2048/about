<script>
  // i wish i also had a Date lmao, i feel lonely a lot
  import { onMount } from "svelte";
  import { Calendar, chunk, repeatEvery } from "../lib/helper";
  import { production } from "../lib/stores";

  import Window from "./Window.svelte";
  const props = {
    focused: true,
    draggable: false,
    title: null,
    buttons: [],
    zIndex: 9999,
    resizable: false,
    width: 352,
    height: 263,
    animateMount: false,
    top: "unset",
    left: "unset",
    style: "right:10px; bottom: 50px;",
    noPadding: true,
  };

  let minutes, hours, seconds, digital;
  onMount(() => {
    function update() {
      const date = new Date();
      // !production && console.info("datewindow clock tick:", date * 1);
      hours = ((date.getHours() + 11) % 12) + 1;
      minutes = date.getMinutes();
      seconds = date.getSeconds();
      digital.innerText = date.toLocaleTimeString();
    }
    update();
    const repeater = repeatEvery(update, 1000);
    return () => repeater.stop();
  });

  // const century = chunk([...Array(200).keys()].map(a=>a+1900),10)

  $: hourDegrees = hours * 30;
  $: minuteDegrees = minutes * 6;
  $: secondDegrees = seconds * 6;

  let state = "days";

  let currentDate = new Date();
  let today = new Date().getDate();

  function getDaysPrev(relative) {
    const year = relative.getFullYear();
    const month = relative.getMonth();
    const weekday = new Date(year, month, 1).getDay();
    if (weekday === 0) return [];
    const isJan = month === 0;
    return Calendar.getDays(isJan ? 11 : month - 1, isJan ? year - 1 : year).slice(-weekday);
  }

  function getNextDays(relative) {
    const year = relative.getFullYear();
    const month = relative.getMonth();
    const toSlice = 42 - (getDaysPrev(relative).length + Calendar.getDays(month, year).length);
    if (toSlice === 0) return [];
    return [...Array(toSlice).keys()].map((a) => a + 1);
  }

  function updateToday() {
    const now = new Date();
    const final = currentDate;
    if (now.getMonth() === final.getMonth() && now.getFullYear() === final.getFullYear()) today = now.getDate();
    else today = null;
  }

  function moveMonth(nav) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    currentDate = new Date(year, month + nav);
    updateToday();
  }

  function moveYear(nav) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    currentDate = new Date(year + nav, month);
    updateToday();
  }
  function chooseMonth(month_index) {
    const year = currentDate.getFullYear();
    currentDate = new Date(year, month_index);
    state = "days";
    updateToday();
  }
  function move(nav) {
    if (state === "days") moveMonth(nav);
    else moveYear(nav);
  }
</script>

<Window {...props}>
  <div id="body">
    <div
      on:click={() => {
        state = "days";
        currentDate = new Date();
        updateToday();
      }}
      id="header"
    >
      {new Date().toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
    </div>
    <div id="title">
      <img draggable="false" on:pointerdown={() => move(-1)} src="./date/button-left.svg" alt />
      <span
        on:click={() => {
          if (state === "days") state = "months";
        }}
      >
        {#if state === "days"}
          {currentDate.toLocaleDateString([], { month: "long" })},
        {/if}
        {currentDate.getFullYear()}</span
      >
      <img draggable="false" on:pointerdown={() => move(1)} src="./date/button-right.svg" alt />
    </div>
    <div id="calendar">
      {#if state === "days"}
        {#each Calendar.getLocaleWeekdays() as day}
          <button class="weekday">{day.slice(0, 2)}</button>
        {/each}
        <div class="line" />
        <div id="days">
          {#each getDaysPrev(currentDate) as prev}
            <button on:pointerdown={() => moveMonth(-1)} class="grey">{prev}</button>
          {/each}
          {#each Calendar.getDays(currentDate.getMonth(), currentDate.getFullYear()) as days (days)}
            <button class:now={days === today}>{days}</button>
          {/each}
          {#each getNextDays(currentDate) as next}
            <button on:pointerdown={() => moveMonth(1)} class="grey">{next}</button>
          {/each}
        </div>
      {:else}
        <div id="dozen">
          {#each Calendar.getLocaleMonths().map((a) => a.slice(0, 3)) as month, i}
            <button on:click={() => chooseMonth(i)}>{month}</button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
  <div id="analog">
    <div style:transform="rotate({hourDegrees}deg)" class="hour-hand" />
    <div style:transform="rotate({minuteDegrees}deg)" class="minute-hand" />
    <div style:transform="rotate({secondDegrees}deg)" class="second-hand" />
  </div>
  <div id="digital" bind:this={digital} />
  <div id="bottom" />
</Window>

<style>
  * {
    user-select: none;
  }
  #header {
    font-size: 12px;
    text-align: center;
    top: 15px;
    position: relative;
    color: #06c;
    cursor: url("./cursor/aero_link.png"), auto;
  }
  #digital {
    position: absolute;
    font-size: 12px;
    width: 126px;
    right: 26px;
    text-align: center;
    bottom: 61px;
  }
  #title {
    font-size: 12px;
    width: 168px;
    text-align: center;
    top: 51px;
    display: flex;
    justify-content: space-between;
  }
  #title img {
    object-position: center 1px;
    filter: brightness(0.6);
  }
  #days {
    display: grid;
    grid-template-columns: repeat(7, 24px);
    grid-template-rows: repeat(7, 15px);
  }
  #dozen {
    display: grid;
    grid-template-columns: repeat(4, 42px);
    grid-template-rows: repeat(3, 35px);
  }
  #dozen button {
    font-size: 12px !important;
  }
  #title,
  #calendar {
    left: 12px;
    position: absolute;
  }
  #calendar {
    top: 73px;
    padding: 0;
  }
  button.weekday {
    pointer-events: none;
    width: 24px;
    height: 15px;
  }
  .line {
    height: 1px;
    width: 155px;
    background-color: #f5f5f5;
    margin-top: 0px;
    margin-left: 6px;
  }
  #calendar button {
    border: transparent 1px solid;
    background: transparent;
    min-width: unset;
    min-height: unset;
    font-size: 11px;
    padding: 0;
    text-align: center;
    line-height: 1;
  }
  button.grey {
    color: #838383;
    box-shadow: unset !important;
    outline: none !important;
  }
  #calendar button.now:not(.grey) {
    box-shadow: inset 0 0 0 1px #0066cc !important;
  }
  #calendar button:not(.grey):hover,
  #calendar button:not(.grey):focus {
    box-shadow: inset 0 0 0 1px #86c6e8;
    background-color: #eff6ff;
  }
  #calendar button:focus {
    outline: 1px dotted #000;
    outline-offset: -3px;
  }
  #analog {
    width: 126px;
    height: 126px;
    background-image: url("./date/clock.png");
    position: absolute;
    right: 26px;
    top: 52px;
  }
  #body {
    height: 204px;
    background-color: white;
    position: relative;
  }
  #bottom {
    height: 43px;
    background-color: #f1f5fb;
    box-shadow: inset 0 7px 8px -10px rgba(0, 0, 0, 0.4);
  }

  #analog > * {
    width: 2px;
    left: 0;
    bottom: 0;
    right: 1.5px;
    margin: auto;
    border-radius: 4px;
    background-color: #69787e;
    transform-origin: bottom;
  }

  .hour-hand {
    position: absolute;
    height: 35px;
    top: -28%;
  }

  .minute-hand {
    position: absolute;
    height: 45px;
    top: -35%;
  }

  .second-hand {
    position: absolute;
    height: 65px;
    width: 1px !important;
    top: -40px;
    transform-origin: center 50px !important;
  }
</style>
