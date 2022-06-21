<script>
  import Window from "./Window.svelte";

  export let volume;
  const props = {
    focused: true,
    draggable: false,
    title: null,
    buttons: [],
    zIndex: 9999,
    resizable: false,
    width: 84,
    height: 304,
    animateMount: false,
    top: "unset",
    left: "unset",
    style: "right:52px; bottom: 50px;",
    noPadding: true,
  };
  let initial;
</script>

<Window {...props}>
  <main>
    <img src="./volume/background.png" alt />
    <div id="slider" class="is-vertical">
      <input
        on:input={function () {
          initial = volume = this.value / 100;
        }}
        type="range"
        min="0"
        max="100"
        value="100"
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
    bottom: 67px;
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
