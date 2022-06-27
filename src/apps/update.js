#!/usr/bin/env node
// run using node.js

import fs from "fs";

const a = (name, index) => `import ${name}, { metadata as props${index} } from "./${name}.svelte";`;
const b = (name, index) => `  ${name}: {
  ...props${index},
  exec: ${name},
},`;

let files = fs
  .readdirSync("./")
  .filter((e) => e !== "update.js" && e !== "apps.svelte")
  .map((e) => e.replace(/.svelte$/, ""));

const final = `<script context="module">
${files.map(a).join("\n")}

export const apps = {
${files.map(b).join("\n")}
};
</script>`;

fs.writeFileSync("./apps.svelte", final);
