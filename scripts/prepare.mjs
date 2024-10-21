/* eslint-disable no-restricted-syntax */

import * as childProcess from "node:child_process";
import { existsSync } from "node:fs";
import * as fs from "node:fs/promises";
import * as util from "node:util";

import { generateDtsBundle } from "dts-bundle-generator";

existsSync("dist") && await fs.rm("dist", { recursive: true });
await fs.mkdir("dist");

console.log("Cleared 'dist' folder");

const exec = util.promisify(childProcess.exec);

console.log("Generating dts bundle...");
let [typedef] = generateDtsBundle([{
    filePath: "repo/src/lib/index.ts",
    output: { noBanner: true }
}], {
    preferredConfigPath: "repo/tsconfig.json"
});

console.log("Generated dts bundle, appending manual declarations");
typedef += await fs.readFile("./index.d.ts");

console.log("Writing main declarations to dist");
await fs.writeFile("./dist/index.d.ts", typedef);

console.log("Generating treetype definition");

// Create a temporary tsconfig.json since treetype checks it before directly accessing dist/index.d.ts
await fs.writeFile("./tsconfig.json", JSON.stringify({ "include": ["dist/index.d.ts"] }));
await exec("pnpm treetype def.tt dist/treetype.d.ts");
await fs.rm("./tsconfig.json");

console.log("Copying misc files");
await fs.writeFile("./dist/package.json", JSON.stringify(Object.assign(JSON.parse(await fs.readFile("./package.json")), {
    dependencies: JSON.parse(await fs.readFile("./repo/package.json")).dependencies,
    pnpm: undefined
}), null, 4))
await fs.copyFile("LICENSE", "./dist/LICENSE");

console.log("Finished");
