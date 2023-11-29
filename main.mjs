#!/usr/bin/env node

import db from "./data.mjs";
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

let file_path = process.argv[2];
if (!file_path) {
  console.error("Missing file argument");
  process.exit(1);
}
const filePath = resolve(file_path);

let contents = await readFile(filePath, { encoding: 'utf8' });

const PINYIN_MAP = new Map(db);

contents = contents.replace(/[A-Za-z]+\d/g, match => {
  let pinyin = PINYIN_MAP.get(match.toLowerCase());
  if (pinyin) {
    if (match[0] === match[0].toUpperCase()) {
      pinyin = pinyin[0].toUpperCase() + pinyin.slice(1);
    }
    return pinyin;
  } else {
    return match;
  }
});


const data = new Uint8Array(Buffer.from(contents));
await writeFile(filePath, data);
