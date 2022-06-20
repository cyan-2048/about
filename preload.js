import fs from "fs";
import path from "path";

function getFiles(directory = "./") {
  function* walkSync(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        yield* walkSync(path.join(dir, file.name));
      } else {
        yield path.join(dir, file.name);
      }
    }
  }

  return [...walkSync(directory)];
}

const files = getFiles("./docs/")
  .filter(function sift(a) {
    return ![".js", ".css", ".html"].some((e) => a.endsWith(e));
  })
  .map((e) => e.replace(/^docs\//, "/"))
  .map((a) => `url(${a})`);

const final = `:root:before {
  content: ${files.join(" ")};
  visibility: hidden;
  position: absolute;
  left: -999em;
}`;

fs.writeFileSync("./docs/preload.css", final);
fs.writeFileSync("./public/preload.css", final);
