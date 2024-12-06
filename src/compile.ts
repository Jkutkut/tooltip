import fs from "fs";
import { transform as lightningcssTransform } from "lightningcss";
import {lzCompressUtf16} from "./plugin/lz";

const SRC_DIRECTORY = import.meta.dirname;
const SRC_TS_FILES = [
  "plugin.ts",
  "plugin.test.ts",
  "autoreload.ts",
].map((file) => `${SRC_DIRECTORY}/${file}`);
const SRC_CSS_FILE = `${SRC_DIRECTORY}/plugin.css`;
const DIST_DIRECTORY = `${import.meta.dirname}/../dist`;
const DIST_CSS_FILE = `${DIST_DIRECTORY}/plugin.min.css`;
const DIST_CSS_OBJ_FILE = `${DIST_DIRECTORY}/plugin.min.css.o`;

const compressFile = (path: string) => {
  return lzCompressUtf16(fs.readFileSync(path, {
    encoding: 'utf8',
  }));
};

const compileCss = () => {
  console.debug("Compiling CSS...");
  const { code } = lightningcssTransform({
    filename: SRC_CSS_FILE,
    code: Buffer.from(fs.readFileSync(SRC_CSS_FILE, {
      encoding: 'utf8',
    })),
    minify: true
  });
  fs.writeFileSync(DIST_CSS_FILE, code);
  fs.writeFileSync(DIST_CSS_OBJ_FILE, compressFile(DIST_CSS_FILE));
  console.debug("CSS compiled");
};

const compileTs = async () => {
  console.debug("Building ts...");
  await Bun.build({
    entrypoints: SRC_TS_FILES,
    outdir: "dist",
    minify: {
      whitespace: true,
      syntax: true,
      identifiers: false,
    }
  });
  console.debug("Code built");
}

const compile = async () => {
  if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist");
  }
  compileCss();
  await compileTs();
};

await compile();
export { compile };
