<script>
  export let runApp;
  export let socials;
</script>

<main>
  <div class="avatar">
    <img src={socials?.discord?.avatar || "./start/default.bmp"} alt />
  </div>
  <div class="body">
    <div class="items">
      <div>Cyan</div>
      <div>Documents</div>
      <div>Pictures</div>
      <div>Music</div>
      <div class="spacer" />
      <div>Favorites</div>
      <div>This PC</div>
      <div class="spacer" />
      <div>Control Panel</div>
      <div>Devices and Printers</div>
      <div
        on:click={function () {
          runApp("Run");
        }}
      >
        Run...
      </div>
    </div>
    <button class="shutdown">Shut Down</button>
  </div>
</main>

<style>
  button.shutdown {
    all: unset;
    width: 100px;
    height: 24px;
    position: absolute;
    bottom: 12px;
    right: 42px;
    padding-left: 8px;
    color: white;
    box-sizing: border-box;
  }
  button:not(:active, :hover) {
    background-image: url(./start/shutdown.png);
  }
  button:hover {
    background-image: url(./start/shutdown-hover.png);
  }
  button:active {
    background-image: url(./start/shutdown-active.png);
  }
  button::after {
    content: "";
    background: url(./start/chev.png);
    width: 7px;
    height: 9px;
    display: block;
    position: absolute;
    right: 7px;
    top: 8px;
  }

  * {
    user-select: none;
  }
  .spacer {
    margin: 8px 0;
    width: 0;
    height: 0;
  }
  .items > *:not(.spacer) {
    color: white;
    width: 140px;
    height: 29px;
    line-height: 28px;
    padding-left: 8px;
  }
  .items > *:not(.spacer):hover {
    background-image: url(./start/start_focus_glass.png);
  }
  .items {
    position: absolute;
    width: 146px;
    top: 42.5px;
    right: -1.5px;
  }
  .body {
    width: 399px;
    top: 26px;
    position: absolute;
  }
  main::before,
  main::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
  }
  main::before {
    background-image: url(./start/menu.webp);
  }
  main::after {
    backdrop-filter: blur(1.5px);
    bottom: 1px;
    z-index: -10;
  }
  .body,
  main::after {
    height: 456px;
  }
  .avatar {
    width: 56px;
    padding: 5px;
    position: absolute;
    right: 46px;
    top: 1px;
  }
  main {
    height: 483px;
    width: 400px;
    position: fixed;
    z-index: 69696969;
    bottom: 38px;
    animation: menu 0.2s ease;
  }
  @keyframes menu {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
