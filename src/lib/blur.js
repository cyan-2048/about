import { production } from "./stores";
// blur image

async function loadImage(url) {
  const d = (src) =>
    new Promise((res, err) => {
      const img = new Image();
      img.src = src;
      img.onload = () => res(img);
      img.onerror = err;
    });
  if (typeof url === "string") return d(url);
  if (url instanceof Blob) {
    const _url = URL.createObjectURL(url);
    const img = await d(_url);
    img.toRevoke = _url;
    return img;
  }
  if (url instanceof Image === false) throw TypeError("not an image element or a url or a blob!");
  if (url.complete) return url;
  return new Promise((res, err) => {
    url.onload = () => res(url);
    url.onerror = err;
  });
}

async function blur({ input, radius, type, quality, canvas: _canvas }) {
  const img = await loadImage(input);
  const canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0);

  let start = +new Date();
  let blur = radius || 2;
  let ctx = canvas.getContext("2d");
  let sum = 0;
  let delta = 5;
  let alpha_left = 1 / (2 * Math.PI * delta * delta);
  let step = blur < 3 ? 1 : 2;
  for (let y = -blur; y <= blur; y += step) {
    for (let x = -blur; x <= blur; x += step) {
      let weight = alpha_left * Math.exp(-(x * x + y * y) / (2 * delta * delta));
      sum += weight;
    }
  }
  for (let y = -blur; y <= blur; y += step) {
    for (let x = -blur; x <= blur; x += step) {
      ctx.globalAlpha = ((alpha_left * Math.exp(-(x * x + y * y) / (2 * delta * delta))) / sum) * blur;
      ctx.drawImage(canvas, x, y);
    }
  }
  ctx.globalAlpha = 1;
  if (img.toRevoke) URL.revokeObjectURL(img.toRevoke);
  !production && console.info("blur time: " + (+new Date() - start) + "ms");

  if (_canvas) return canvas;
  return new Promise((res) => canvas.toBlob(res, type, quality));
}

export default blur;
