"use strict";

import clear from 'rollup-plugin-clear';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import screeps from 'rollup-plugin-screeps';
import terser from '@rollup/plugin-terser';

let cfg;
const dest = process.env.DEST;
if (!dest) {
  console.log("No destination specified - code will be compiled but not uploaded");
} else if ((cfg = require("./screeps.json")[dest]) == null) {
  throw new Error("Invalid upload destination");
}

export default {
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    format: "cjs",
    sourcemap: true,
    compact: true,
    freeze: false,
    hoistTransitiveImports: false
  },

  plugins: [
    clear({ targets: ["dist"] }),
    resolve({ rootDir: "src", preferBuiltins: true }),
    commonjs(),
    typescript({
        tsconfig: "tsconfig.json",
        noEmitOnError: true,  // This will make the build fail on TS errors
        outputToFilesystem: true,  // Ensures proper file system output
        typescript: require("typescript") // Use local typescript installation

      }
    ),
    screeps({config: cfg, dryRun: cfg == null}),
    terser({
      format: {
        comments: false,
        ecma: 2018
      },
      compress: {
        ecma: 2018,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_methods: true,
        unsafe_proto: true,
        passes: 2,
        pure_getters: true,
        reduce_vars: true,
        join_vars: true
      }
    })
  ]
}
