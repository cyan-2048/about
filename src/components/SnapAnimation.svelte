<script>
  import xy from "../lib/xy";
  export let direction = null;

  let left = null,
    right = null,
    top = null;

  if (direction) {
    const [x, y] = xy(true).map((a) => a - 32.5 + "px");
    const o = "-32.5px";
    if (direction === "left") {
      left = o;
      top = y;
    } else if (direction === "right") {
      right = o;
      top = y;
    } else {
      top = o;
      left = x;
    }
  }
</script>

<main style:top style:left style:right />

<style>
  main {
    position: fixed;
    width: 65px;
    height: 65px;
    background-image: url("./snap_sprite.png");
    animation: sprite 0.3s steps(13) forwards;
    z-index: 696969;
  }
  @keyframes sprite {
    from {
      background-position: 0px;
    }
    to {
      background-position: -840px;
    }
  }
</style>
