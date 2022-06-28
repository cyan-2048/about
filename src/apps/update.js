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
  .filter((e) => e.includes(".svelte"))
  .map((e) => e.replace(/.svelte$/, ""));

const final = `${files.map(a).join("\n")}

const apps = {${files.map(b).join("\n")}};

export default apps;
`;

fs.writeFileSync("./index.js", final);
