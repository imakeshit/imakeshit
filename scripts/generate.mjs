// ============================================================
//  beingDurgesh profile README - pixel dashboard asset generator
//  Generates every SVG in assets/ with zero dependencies.
//  Run:  node scripts/generate.mjs
// ============================================================
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = join(ROOT, "assets");
mkdirSync(ASSETS, { recursive: true });

// ---------- palette ----------
const C = {
  panel: "#0a0f1f",
  panel2: "#0e1526",
  text: "#eef2ff",
  dim: "#9aa7c7",
  mute: "#5f6d8f",
  green: "#43e08d",
  cyan: "#4fd8eb",
  pink: "#ff6ea9",
  gold: "#ffc94d",
  purple: "#a78bfa",
  red: "#ff5c5c",
  blue: "#5a9cf8",
  orange: "#ff9a4d",
  line: "#2b3a55",
};

// ---------- tiny helpers ----------
const n = (v) => (Math.round(v * 100) / 100).toString();
const rect = (x, y, w, h, fill, rx = 0, op = 1) =>
  `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${fill}"` +
  (rx ? ` rx="${n(rx)}"` : "") +
  (op !== 1 ? ` opacity="${n(op)}"` : "") + "/>";

const svgWrap = (w, h, inner, defs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">${defs}${inner}</svg>`;

// ---------- 5x7 pixel font ----------
const F = {
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
  C: [".####", "#....", "#....", "#....", "#....", "#....", ".####"],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  G: [".###.", "#...#", "#....", "#..##", "#...#", "#...#", ".###."],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  I: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "#####"],
  J: ["....#", "....#", "....#", "....#", "#...#", "#...#", ".###."],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#...#", "#...#", "#...#", "#...#"],
  N: ["#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  Q: [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  W: ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "##.##", "#...#"],
  X: ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  Z: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],
  0: [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
  1: ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  2: [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
  3: ["#####", "...#.", "..#..", "...#.", "....#", "#...#", ".###."],
  4: ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  5: ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
  6: ["..##.", ".#...", "#....", "####.", "#...#", "#...#", ".###."],
  7: ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
  8: [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  9: [".###.", "#...#", "#...#", ".####", "....#", "...#.", ".##.."],
  a: [".....", ".....", ".###.", "....#", ".####", "#...#", ".####"],
  b: ["#....", "#....", "####.", "#...#", "#...#", "#...#", "####."],
  c: [".....", ".....", ".####", "#....", "#....", "#....", ".####"],
  d: ["....#", "....#", ".####", "#...#", "#...#", "#...#", ".####"],
  e: [".....", ".....", ".###.", "#...#", "#####", "#....", ".###."],
  f: ["..##.", ".#...", "####.", ".#...", ".#...", ".#...", ".#..."],
  g: [".....", ".###.", "#...#", "#...#", ".####", "....#", ".###."],
  h: ["#....", "#....", "####.", "#...#", "#...#", "#...#", "#...#"],
  i: ["..#..", ".....", ".##..", "..#..", "..#..", "..#..", ".###."],
  j: ["...#.", ".....", "...#.", "...#.", "...#.", "#..#.", ".##.."],
  k: ["#....", "#....", "#..#.", "#.#..", "##...", "#.#..", "#..#."],
  l: [".##..", "..#..", "..#..", "..#..", "..#..", "..#..", ".###."],
  m: [".....", ".....", "##.##", "#.#.#", "#.#.#", "#.#.#", "#.#.#"],
  n: [".....", ".....", "####.", "#...#", "#...#", "#...#", "#...#"],
  o: [".....", ".....", ".###.", "#...#", "#...#", "#...#", ".###."],
  p: [".....", "####.", "#...#", "#...#", "####.", "#....", "#...."],
  q: [".....", ".####", "#...#", "#...#", ".####", "....#", "....#"],
  r: [".....", ".....", "#.##.", "##...", "#....", "#....", "#...."],
  s: [".....", ".....", ".####", "#....", ".###.", "....#", "####."],
  t: [".#...", ".#...", "####.", ".#...", ".#...", ".#..#", "..##."],
  u: [".....", ".....", "#...#", "#...#", "#...#", "#...#", ".####"],
  v: [".....", ".....", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  w: [".....", ".....", "#...#", "#...#", "#.#.#", "#.#.#", ".#.#."],
  x: [".....", ".....", "#...#", ".#.#.", "..#..", ".#.#.", "#...#"],
  y: [".....", ".....", "#...#", "#...#", "#...#", ".####", "....#"],
  z: [".....", ".....", "#####", "...#.", "..#..", ".#...", "#####"],
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
  ".": [".....", ".....", ".....", ".....", ".....", ".##..", ".##.."],
  ",": [".....", ".....", ".....", ".....", ".##..", ".##..", ".#..."],
  ":": [".....", ".##..", ".##..", ".....", ".##..", ".##..", "....."],
  ";": [".....", ".##..", ".##..", ".....", ".##..", ".##..", ".#..."],
  "!": ["..#..", "..#..", "..#..", "..#..", "..#..", ".....", "..#.."],
  "?": [".###.", "#...#", "....#", "...#.", "..#..", ".....", "..#.."],
  "'": ["..#..", "..#..", ".....", ".....", ".....", ".....", "....."],
  '"': [".#.#.", ".#.#.", ".....", ".....", ".....", ".....", "....."],
  "(": ["...#.", "..#..", ".#...", ".#...", ".#...", "..#..", "...#."],
  ")": [".#...", "..#..", "...#.", "...#.", "...#.", "..#..", ".#..."],
  "[": ["..##.", "..#..", "..#..", "..#..", "..#..", "..#..", "..##."],
  "]": [".##..", "..#..", "..#..", "..#..", "..#..", "..#..", ".##.."],
  "{": ["..##.", ".#...", ".#...", ".#...", ".#...", ".#...", "..##."],
  "}": [".##..", "...#.", "...#.", "...#.", "...#.", "...#.", ".##.."],
  "/": ["....#", "....#", "...#.", "..#..", ".#...", "#....", "#...."],
  "\\": ["#....", "#....", ".#...", "..#..", "...#.", "....#", "....#"],
  "|": ["..#..", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  "<": ["...#.", "..#..", ".#...", "#....", ".#...", "..#..", "...#."],
  ">": [".#...", "..#..", "...#.", "....#", "...#.", "..#..", ".#..."],
  "-": [".....", ".....", ".....", "#####", ".....", ".....", "....."],
  "_": [".....", ".....", ".....", ".....", ".....", ".....", "#####"],
  "+": [".....", "..#..", "..#..", "#####", "..#..", "..#..", "....."],
  "=": [".....", ".....", "#####", ".....", "#####", ".....", "....."],
  "*": [".....", "..#..", "#.#.#", ".###.", "#.#.#", "..#..", "....."],
  "#": [".#.#.", ".#.#.", "#####", ".#.#.", "#####", ".#.#.", ".#.#."],
  "%": ["##..#", "##..#", "...#.", "..#..", ".#...", "#..##", "#..##"],
  "&": [".##..", "#..#.", "#.#..", ".#...", "#.#.#", "#..#.", ".##.#"],
  "@": [".###.", "#...#", "#.###", "#.#.#", "#.###", "#....", ".###."],
  "~": [".....", ".....", ".#..#", "#.#.#", "#..#.", ".....", "....."],
  "^": ["..#..", ".###.", "#...#", ".....", ".....", ".....", "....."],
  "\u00b7": [".....", ".....", ".....", "..#..", ".....", ".....", "....."],
  "\u2022": [".....", ".....", ".##..", ".##..", ".....", ".....", "....."],
  "\u2192": [".....", "..#..", "...#.", "#####", "...#.", "..#..", "....."],
  "\u2713": [".....", "....#", "....#", "#...#", ".#.#.", "..#..", "....."],
};

function runMerge(row, max, x0, y0, s, colors) {
  // merge consecutive same-char pixels into one rect
  let out = "", c = 0;
  while (c < max) {
    const ch = row[c];
    if (ch === "." || ch === undefined || !colors[ch]) { c++; continue; }
    let c2 = c;
    while (c2 + 1 < max && row[c2 + 1] === ch) c2++;
    out += rect(x0 + c * s, y0, (c2 - c + 1) * s, s, colors[ch]);
    c = c2 + 1;
  }
  return out;
}

// text = pixel font rendered from rects (no <text>, renders identically everywhere)
function measure(str, s = 2, sp = 1) {
  return str.length * (5 + sp) * s - sp * s;
}
function pixelText(str, x, y, o = {}) {
  const s = o.s ?? 2, color = o.color ?? C.text, sp = o.sp ?? 1;
  const w = measure(str, s, sp);
  let ox = x;
  if (o.align === "center") ox = x - w / 2;
  if (o.align === "right") ox = x - w;
  let g = "", cx = ox;
  for (const ch of str) {
    const rows = F[ch] || F["?"];
    for (let r = 0; r < 7; r++) g += runMerge(rows[r], 5, cx, y + r * s, s, { "#": color });
    cx += (5 + sp) * s;
  }
  return { svg: g, w, h: 7 * s, x: ox, y };
}
function wrapText(str, maxW, s = 2, sp = 1) {
  const words = str.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (measure(test, s, sp) <= maxW || !cur) cur = test;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}
function textBlock(str, x, y, maxW, o = {}) {
  const s = o.s ?? 2, sp = o.sp ?? 1, lh = o.lh ?? 7 * s + 6;
  let g = "";
  wrapText(str, maxW, s, sp).forEach((line, i) => {
    g += pixelText(line, x, y + i * lh, o).svg;
  });
  return g;
}
function fitScale(str, maxW, sMax = 2, sp = 1) {
  let s = sMax;
  while (s > 0.75 && measure(str, s, sp) > maxW) s -= 0.25;
  return s;
}

// sprite / icon grids -> rects
function grid(rows, pal, s, x, y) {
  let out = "";
  for (let r = 0; r < rows.length; r++) out += runMerge(rows[r], rows[r].length, x, y + r * s, s, pal);
  return out;
}

// ---------- shared frame ----------
function bracket(w, h, c, x0 = 0) {
  const L = 20, t = 2.5, i = 8;
  return rect(x0 + i, i, L, t, c) + rect(x0 + i, i, t, L, c) +
    rect(x0 + w - i - L, i, L, t, c) + rect(x0 + w - i - t, i, t, L, c) +
    rect(x0 + i, h - i - t, L, t, c) + rect(x0 + i, h - i - L, t, L, c) +
    rect(x0 + w - i - L, h - i - t, L, t, c) + rect(x0 + w - i - t, h - i - L, t, L, c);
}
function panel(w, h, accent, x0 = 0) {
  return rect(x0, 0, w, h, C.panel, 14) +
    `<rect x="${n(x0 + 0.75)}" y="0.75" width="${n(w - 1.5)}" height="${n(h - 1.5)}" rx="13" fill="none" stroke="${accent}" stroke-opacity="0.5" stroke-width="1.5"/>` +
    bracket(w, h, accent, x0);
}

// ---------- PRNG (deterministic scenes) ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- pixel icons ----------
const ico = (rows, pal, s, x, y) => grid(rows, pal, s, x, y);

function iconCrown(x, y, s) {
  const rows = [
    ".#.......#.",
    ".#...#...#.",
    ".#...#...#.",
    ".#########.",
    ".#########.",
    "..#..g..#..",
    ".#########.",
    ".ddddddddd.",
  ];
  return ico(rows, { "#": "#ffc94d", g: "#ff5c7a", d: "#c9922e" }, s, x, y);
}
function iconHeart(x, y, s, half = false) {
  const full = [
    ".rr.rr.",
    "rrrrrrr",
    "rrrrrrr",
    ".rrrrr.",
    "..rrr..",
    "...r...",
  ];
  const palf = { r: "#ff5c7a" };
  if (!half) return ico(full, palf, s, x, y);
  // half = right side dim
  let out = ico(full, palf, s, x, y);
  for (let r = 0; r < full.length; r++) {
    const row = full[r];
    for (let c = 4; c < 7; c++) if (row[c] === "r") out += rect(x + c * s, y + r * s, s, s, "#3a2740");
  }
  return out;
}
function iconStar(x, y, s, color = "#ffc94d") {
  const rows = ["...y...", "...y...", "..yyy..", "yyyyyyy", ".yyyyy.", "..y.y..", ".y...y."];
  return ico(rows, { y: color }, s, x, y);
}
function iconSparkle(x, y, s, color = "#cfe3ff") {
  const rows = ["..#..", "..#..", "#####", "..#..", "..#.."];
  return ico(rows, { "#": color }, s, x, y);
}
function iconRocket(x, y, s) {
  const rows = [
    "....w....",
    "...www...",
    "...www...",
    "..wwcww..",
    "..wwcww..",
    "..wwwww..",
    ".swwwwws.",
    ".swwwwws.",
    "rswwwwwsr",
    "rr.www.rr",
    "...ooo...",
    "...oOo...",
    "....o....",
  ];
  return ico(rows, { w: "#e8edff", s: "#9aa7c7", c: "#4fd8eb", r: "#ff5c5c", o: "#ff9a4d", O: "#ffd54a" }, s, x, y);
}
function iconChest(x, y, s) {
  const rows = [
    ".dddddddddd.",
    ".ddyyyyyydd.",
    ".dddddddddd.",
    "yyyyyyyyyyyy",
    ".dddddddddd.",
    ".ddddkkdddd.",
    ".ddddkkdddd.",
    ".dddddddddd.",
  ];
  return ico(rows, { d: "#7a4a1f", y: "#ffd54a", k: "#ffc94d" }, s, x, y);
}
function iconTrophy(x, y, s) {
  const rows = [
    ".yyyyyyyyy.",
    ".yyyyyyyyy.",
    "..yyyyyyy..",
    "...yyyyy...",
    "....yyy....",
    "....yyy....",
    ".....y.....",
    "..yyyyyyy..",
    ".yyyyyyyyy.",
    "..yyyyyyy..",
  ];
  return ico(rows, { y: "#ffc94d" }, s, x, y);
}
function iconGift(x, y, s) {
  const rows = [
    ".....y.....",
    "....yyy....",
    "...y.y.y...",
    "....yyy....",
    ".....y.....",
    "yyyyyyyyyyy",
    ".rrrryyrrr.",
    ".rrrryyrrr.",
    ".rrrryyrrr.",
    "yyyyyyyyyyy",
  ];
  return ico(rows, { y: "#ffc94d", r: "#ff5c7a" }, s, x, y);
}
function iconCog(x, y, s, c = "#8ea3c9") {
  const rows = [
    "...g...g...",
    "..ggg.ggg..",
    "..ggggggg..",
    "gggg...gggg",
    "ggg..c..ggg",
    "gggg...gggg",
    "..ggggggg..",
    "..ggg.ggg..",
    "...g...g...",
  ];
  return ico(rows, { g: c, c: "#4fd8eb" }, s, x, y);
}
function iconChart(x, y, s) {
  let out = "";
  out += rect(x, y + 6 * s, 2 * s, 3 * s, "#4fd8eb");
  out += rect(x + 3 * s, y + 4 * s, 2 * s, 5 * s, "#2dd4bf");
  out += rect(x + 6 * s, y + 2 * s, 2 * s, 7 * s, "#43e08d");
  out += rect(x, y + 9 * s, 8 * s, s, "#8ea3c9");
  return out;
}
function iconTerminal(x, y, s) {
  return pixelText(">_", x, y, { s, color: C.green }).svg;
}
function iconCheck(x, y, size) {
  // filled green rounded square with dark check
  const ts = size / 14;
  let out = rect(x, y, size, size, C.green, size * 0.28);
  out += pixelText("\u2713", x + size * 0.22, y + size * 0.2, { s: ts, color: "#06281a" }).svg;
  return out;
}
function iconBox(x, y, size, color = C.mute) {
  return `<rect x="${n(x)}" y="${n(y)}" width="${n(size)}" height="${n(size)}" rx="${n(size * 0.22)}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
}
function iconDot(x, y, r, color) {
  return `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${color}"/>`;
}
function iconLinkedIn(x, y, size) {
  const ts = size / 11;
  let out = rect(x, y, size, size, "#2f6fbf", size * 0.22);
  out += pixelText("in", x + size * 0.2, y + size * 0.25, { s: ts, color: "#fff" }).svg;
  return out;
}
function iconX(x, y, size) {
  const ts = size / 11;
  let out = rect(x, y, size, size, "#0d1017", size * 0.22);
  out += `<rect x="${n(x)}" y="${n(y)}" width="${n(size)}" height="${n(size)}" rx="${n(size * 0.22)}" fill="none" stroke="#3d4457" stroke-width="1"/>`;
  out += pixelText("X", x + size * 0.24, y + size * 0.25, { s: ts, color: "#fff" }).svg;
  return out;
}
function iconMail(x, y, size) {
  const w = size, h = size * 0.78;
  let out = rect(x, y, w, h, "#1d2a44", 2);
  out += `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="2" fill="none" stroke="#8ea3c9" stroke-width="1"/>`;
  out += `<path d="M${n(x + 1)} ${n(y + 1.5)} L${n(x + w / 2)} ${n(y + h / 2)} L${n(x + w - 1)} ${n(y + 1.5)}" stroke="#8ea3c9" stroke-width="1.2" fill="none"/>`;
  return out;
}
function iconTarget(x, y, size) {
  const r = size / 2, cx = x + r, cy = y + r;
  return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="none" stroke="#4fd8eb" stroke-width="1.5"/>` +
    `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 0.55)}" fill="none" stroke="#8ea3c9" stroke-width="1.2"/>` +
    iconDot(cx, cy, r * 0.25, "#43e08d");
}
function iconPerson(x, y, s, color = "#8ea3c9") {
  const rows = ["..ppp..", ".ppppp.", "..ppp..", ".ppppp.", "ppppppp"];
  return ico(rows, { p: color }, s, x, y);
}
function iconPeeps(x, y, s) {
  return ico(["..ppp..", ".ppppp.", "..ppp..", ".ppppp.", "ppppppp"], { p: "#a78bfa" }, s, x + 2 * s, y) +
    ico(["..ppp..", ".ppppp.", "..ppp..", ".ppppp.", "ppppppp"], { p: "#8ea3c9" }, s * 0.8, x - s, y + 2);
}
function iconFolder(x, y, s) {
  const rows = [
    "..........",
    "..ffff....",
    "ffffffffff",
    "f........f",
    "f..fdd...f",
    "f........f",
    "ffffffffff",
  ];
  return ico(rows, { f: "#4fd8eb", d: "#8ea3c9" }, s, x, y);
}
function iconCommit(x, y, s) {
  let out = rect(x + 3.5 * s, y + 2.5 * s, s, 5 * s, "#8ea3c9");
  out += iconDot(x + 4 * s, y + 1.5 * s, 2 * s, "#43e08d");
  out += iconDot(x + 4 * s, y + 8.5 * s, 2 * s, "#43e08d");
  out += `<path d="M${n(x + 4 * s)} ${n(y + 4 * s)} Q ${n(x + 8 * s)} ${n(y + 4 * s)} ${n(x + 8 * s)} ${n(y + 7 * s)}" stroke="#8ea3c9" stroke-width="1.5" fill="none"/>`;
  out += iconDot(x + 8 * s, y + 8 * s, 1.6 * s, "#a78bfa");
  return out;
}
function iconFollow(x, y, s) {
  return iconPerson(x, y, s, "#8ea3c9") + pixelText("+", x + 9 * s, y + s, { s, color: "#43e08d" }).svg;
}
function iconPython(x, y, s) {
  const rows = [
    ".bbbbb.....",
    ".bbbbb.....",
    ".bb.bb.....",
    ".bbbbbbbb..",
    ".bbbb.bbb..",
    "......bbb..",
    "......bb.bb",
  ];
  // blue top snake, yellow bottom snout
  let out = ico(rows, { b: "#4b8bbe" }, s, x, y);
  const rowsY = [
    "yy.....yyy.",
    "yyy...yyyy.",
    ".yyyyyyyyy.",
    "...yyyyyy..",
    "...yy.yyy..",
    "...yyyyyy..",
    "...yyyyy...",
  ];
  out += ico(rowsY, { y: "#ffd43b" }, s, x, y + 7 * s);
  return out;
}
function iconRust(x, y, s) {
  const rows = [
    ".oooo.o...",
    "oooooooo..",
    "ooo.oooo..",
    "oooooooo..",
    ".ooooooo..",
    "..o.oooo..",
    "oooooooo..",
    ".ooo.ooo..",
  ];
  return ico(rows, { o: "#dea584" }, s, x, y);
}
function iconHex(x, y, s, label, labelColor = "#fff") {
  const rows = [
    "...bbbbb...",
    "..bbbbbbb..",
    ".bbbbbbbbb.",
    "bbbbbbbbbbb",
    "bbbbbbbbbbb",
    "bbbbbbbbbbb",
    ".bbbbbbbbb.",
    "..bbbbbbb..",
    "...bbbbb...",
  ];
  let out = ico(rows, { b: "#2f6fbf" }, s, x, y);
  const t = pixelText(label, 0, 0, { s: s / 2, color: labelColor });
  out += pixelText(label, x + 5.5 * s - t.w / 2, y + 9 * s / 2 - t.h / 2, { s: s / 2, color: labelColor }).svg;
  return out;
}
function iconDB(x, y, s) {
  const rows = [
    "..bbbbbbb..",
    ".b.......b.",
    "..bbbbbbb..",
    ".b.......b.",
    ".b.......b.",
    ".bbbbbbbbb.",
    ".b.......b.",
    ".b.......b.",
    ".b.......b.",
    "..bbbbbbb..",
  ];
  return ico(rows, { b: "#6aa84f" }, s, x, y);
}
function iconBrain(x, y, s) {
  const rows = [
    "..p.p.p...",
    ".pPp.pPp..",
    ".pppppppp.",
    "p.ppppp..p",
    ".pp.pp.pp.",
    "p.ppppppp.",
    ".pp.....pp",
    "..ppppppp.",
    "....p.pp..",
  ];
  return ico(rows, { p: "#a78bfa", P: "#d6c8ff" }, s, x, y);
}
function iconChip(x, y, s) {
  const rows = [
    "..p.p.p.p..",
    "..p.p.p.p..",
    "ppppppppppp",
    "p.........p",
    "p..ppp.p..p",
    "p..p.p.p..p",
    "p..ppp.p..p",
    "p.........p",
    "ppppppppppp",
    "..p.p.p.p..",
    "..p.p.p.p..",
  ];
  return ico(rows, { p: "#a78bfa" }, s, x, y);
}
function iconOcto(x, y, s) {
  // simple octocat-ish: ears + head circle cut
  const r = 5 * s;
  return `<circle cx="${n(x + r)}" cy="${n(y + r + s)}" r="${n(r)}" fill="#e8edff"/>` +
    ico([".#", "#."], { "#": "#e8edff" }, s * 1.5, x + r - 2.2 * s, y - s) +
    ico([".#", "#."], { "#": "#e8edff" }, s * 1.5, x + r + 0.2 * s, y - s) +
    `<circle cx="${n(x + r)}" cy="${n(y + r * 1.6)}" r="${n(2.4 * s)}" fill="#0a0f1f"/>` +
    ico(["#.#"], { "#": "#0a0f1f" }, s, x + r - 1.5 * s, y + r * 1.6) +
    `<path d="M${n(x + r - 3 * s)} ${n(y + r + s)} q ${n(3 * s)} ${n(2.5 * s)} ${n(6 * s)} 0" stroke="#0a0f1f" stroke-width="${n(s)}" fill="none"/>`;
}
function pine(x, y, h, w, c1, c2) {
  // pixel pine: stacked rows, runs merged
  let out = "";
  const rows = Math.max(6, Math.floor(h / 3));
  const rowH = h / rows;
  for (let r = 0; r < rows; r++) {
    const t = r / (rows - 1);
    const half = (w / 2) * (0.25 + 0.75 * t);
    const jitter = (r % 2 === 0 ? 0 : 1) * (w / 14);
    out += rect(x + w / 2 - half - jitter, y + r * rowH, half * 2 + jitter * 2, rowH + 0.5, r < 2 ? c2 : c1);
  }
  out += rect(x + w / 2 - w / 10, y + h, w / 5, h / 5, "#3a2a1c");
  return out;
}
function mountainRange(x0, x1, baseY, minH, maxH, step, color, rnd, rimColor = null, rimZone = null) {
  let out = "";
  let h = (minH + maxH) / 2;
  for (let x = x0; x < x1; x += step) {
    h += (rnd() - 0.5) * maxH * 0.5;
    h = Math.max(minH, Math.min(maxH, h));
    out += rect(x, baseY - h, step + 0.5, h, color);
    if (rimColor && (!rimZone || (x >= rimZone[0] && x <= rimZone[1])))
      out += rect(x, baseY - h, step + 0.5, 3, rimColor);
  }
  return out;
}

// ---------- sprites ----------
function boySitting(x, y, s) {
  const rows = [
    "......hhhhh.....",
    ".....hhhhhhh....",
    "....hhhhhhhhh...",
    "....hhhhhhhhh...",
    ".....hhhhhhh..r.",
    "..j..jjjjjj...r.",
    "..jjjjjjjjjj....",
    ".jjppppppppjj...",
    ".jjppppppppjj...",
    ".jjpppPPpppjj.r.",
    ".jjpppPPpppjj.r.",
    ".jjppppppppjj.r.",
    ".jjppppppppjj...",
    "..jjjjjjjjjj....",
    "...jjjjjjjj.....",
    "...jjj...jjjj...",
    "..nnn.....nnnn..",
    "..nnn......nnn..",
    ".kkkk.....kkkkk.",
  ];
  return grid(rows, { h: "#232a49", j: "#2e3f63", p: "#c96a3a", P: "#e8894f", n: "#1a2138", k: "#0b0e1c", r: "#ff9a4d" }, s, x, y);
}
function boyStanding(x, y, s) {
  const rows = [
    "...hhhhhh...",
    "..hhhhhhhh..",
    "..hhhhhhhh..",
    "..hhhhhhhh..",
    "...jjjjjj...",
    "..jppppppj..",
    "..jppppppj..",
    "..jpppPppj..",
    "..jppppppj..",
    "..jppppppj..",
    "..jjppppjj..",
    "...jjjjjj...",
    "...jj..jj...",
    "...nn..nn...",
    "...nn..nn...",
    "...kk..kk...",
  ];
  return grid(rows, { h: "#232a49", j: "#2e3f63", p: "#c96a3a", P: "#e8894f", n: "#1a2138", k: "#0b0e1c" }, s, x, y);
}
function cloud(x, y, w, h, color, op) {
  return rect(x + w * 0.2, y, w * 0.6, h * 0.5, color, h * 0.25, op) +
    rect(x, y + h * 0.35, w, h * 0.45, color, h * 0.22, op) +
    rect(x + w * 0.25, y + h * 0.72, w * 0.55, h * 0.28, color, h * 0.14, op);
}
function ticks(x, y, w, h, c, len = 14, t = 2.5) {
  return rect(x, y, len, t, c) + rect(x, y, t, len, c) +
    rect(x + w - len, y, len, t, c) + rect(x + w - t, y, t, len, c) +
    rect(x, y + h - t, len, t, c) + rect(x, y + h - len, t, len, c) +
    rect(x + w - len, y + h - t, len, t, c) + rect(x + w - t, y + h - len, t, len, c);
}

// ============================================================
//  BANNER
// ============================================================
function buildBanner() {
  const W = 880, H = 470;
  const rnd = mulberry32(20261015);
  const defs = `<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#0a0e20"/><stop offset="0.4" stop-color="#1a1238"/>
<stop offset="0.68" stop-color="#3d2154"/><stop offset="0.86" stop-color="#74395f"/>
<stop offset="1" stop-color="#8a4560"/></linearGradient>
<linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#2a2a55"/><stop offset="1" stop-color="#0b1126"/></linearGradient>
<radialGradient id="hglow" gradientUnits="userSpaceOnUse" cx="430" cy="382" r="320">
<stop offset="0" stop-color="#ffb35c" stop-opacity="0.5"/><stop offset="0.5" stop-color="#ff8a6b" stop-opacity="0.16"/>
<stop offset="1" stop-color="#ff8a6b" stop-opacity="0"/></radialGradient>
<radialGradient id="mglow" gradientUnits="userSpaceOnUse" cx="740" cy="90" r="86">
<stop offset="0" stop-color="#dfe6ff" stop-opacity="0.5"/><stop offset="1" stop-color="#dfe6ff" stop-opacity="0"/></radialGradient>
<mask id="sunmask"><rect x="370" y="290" width="130" height="120" fill="#fff"/>
<rect x="370" y="352" width="130" height="5" fill="#000"/><rect x="370" y="362" width="130" height="5" fill="#000"/>
<rect x="370" y="372" width="130" height="5" fill="#000"/><rect x="370" y="382" width="130" height="5" fill="#000"/>
<rect x="370" y="392" width="130" height="5" fill="#000"/></mask>
<filter id="tglow" x="-25%" y="-40%" width="150%" height="180%"><feGaussianBlur stdDeviation="8"/></filter>
<clipPath id="round"><rect x="0" y="0" width="${W}" height="${H}" rx="16"/></clipPath>
</defs>`;

  let g = "";
  // sky
  g += rect(0, 0, W, H, "url(#sky)");
  // stars
  for (let i = 0; i < 95; i++) {
    const sx = rnd() * W, sy = rnd() * 258 + 6, sz = rnd() < 0.14 ? 2 : 1.2;
    const col = rnd() < 0.75 ? "#ffffff" : rnd() < 0.5 ? "#9fd8ff" : "#ffd9a0";
    g += rect(sx, sy, sz, sz, col, 0, 0.35 + rnd() * 0.6);
  }
  g += iconSparkle(163, 66, 2.2) + iconSparkle(320, 128, 1.6) + iconSparkle(560, 60, 2) + iconSparkle(806, 210, 1.6) + iconSparkle(120, 220, 1.4);
  // moon
  g += `<circle cx="740" cy="90" r="86" fill="url(#mglow)"/>`;
  g += `<circle cx="740" cy="90" r="38" fill="#e7ecff"/>`;
  g += `<circle cx="727" cy="79" r="6" fill="#c3cdec"/><circle cx="752" cy="98" r="8" fill="#c3cdec"/><circle cx="737" cy="107" r="4" fill="#c3cdec"/>`;
  // clouds
  g += cloud(70, 200, 130, 26, "#6b5a8e", 0.33) + cloud(660, 170, 150, 30, "#6b5a8e", 0.3) + cloud(300, 235, 110, 22, "#8a5f7e", 0.28);
  // horizon glow
  g += rect(0, 230, W, 160, "url(#hglow)");
  // distant mountains
  g += mountainRange(0, W, 386, 66, 132, 16, "#241d45", rnd);
  // sun
  g += `<g mask="url(#sunmask)"><circle cx="430" cy="352" r="42" fill="#ffcf7a"/><circle cx="430" cy="356" r="36" fill="#ff9a4d"/><circle cx="430" cy="362" r="26" fill="#ff7a55"/></g>`;
  // mid mountains (rim-lit)
  g += mountainRange(0, W, 386, 42, 96, 18, "#161d3a", rnd, "rgba(255,154,77,0.4)", [180, 700]);
  // front mountains
  g += mountainRange(0, W, 386, 18, 58, 22, "#0f1430", rnd);
  // water
  g += rect(0, 386, W, H - 386, "url(#water)");
  for (let i = 0; i < 70; i++) {
    const rx = rnd() * W, ry = 392 + rnd() * 66, rw = 8 + rnd() * 42;
    let col = "#4fd8eb", op = 0.14;
    if (rx > 270 && rx < 600) { col = "#ff9a4d"; op = 0.3; }
    else if (rx > 640 && rx < 840) { col = "#cfd8ff"; op = 0.24; }
    g += rect(rx, ry, rw, 2, col, 0, op * (1 - (ry - 392) / 90));
  }
  // city skyline
  const buildings = [
    [598, 30, 118], [632, 22, 84], [658, 38, 150], [700, 26, 100],
    [730, 34, 132], [768, 22, 76], [794, 40, 158], [838, 26, 96],
  ];
  const winCols = ["#ff6ea9", "#4fd8eb", "#ffd54a", "#a78bfa", "#e8edff"];
  buildings.forEach(([bx, bw, bh], bi) => {
    const top = 386 - bh;
    g += rect(bx, top, bw, bh, "#0a0c1c", 2);
    for (let wx = bx + 4; wx < bx + bw - 5; wx += 8) {
      for (let wy = top + 6; wy < 380; wy += 11) {
        if (rnd() < 0.30) g += rect(wx, wy, 4, 6, winCols[Math.floor(rnd() * winCols.length)], 0, 0.85);
      }
    }
    if (bi === 6) g += rect(bx + 19, top - 16, 2, 16, "#2b3a55") + iconDot(bx + 20, top - 18, 2.5, "#ff5c5c");
    if (bi === 2) g += rect(bx + 17, top - 12, 2, 12, "#2b3a55") + iconDot(bx + 18, top - 14, 2, "#ffd54a");
  });
  // bridge
  g += rect(150, 380, 470, 3, "#2a3352");
  for (let px = 170, i = 0; px <= 600; px += 55, i++) {
    g += rect(px, 383, 3, 16, "#1c2340");
    if (i % 2 === 0) g += rect(px - 1, 378, 4, 2, "#ffd54a", 0, 0.85);
  }
  // foreground trees
  g += pine(10, 336, 50, 24, "#0b1a12", "#123027") + pine(44, 344, 42, 20, "#0d2016", "#164030") +
    pine(74, 338, 54, 26, "#0b1a12", "#123027") + pine(108, 352, 34, 16, "#0d2016", "#164030");
  g += pine(806, 344, 44, 20, "#0d2016", "#164030") + pine(838, 330, 58, 26, "#0b1a12", "#123027") + pine(870, 352, 34, 16, "#0b1a12", "#123027");
  // cliff + boy
  g += rect(112, 352, 58, 14, "#1a2340") + rect(104, 366, 74, 10, "#141b32") + rect(96, 376, 90, 10, "#101527");
  g += boySitting(118, 297, 2.75);
  // saucer + trail
  g += rect(622, 124, 10, 2, "#4fd8eb", 0, 0.55) + rect(640, 124, 14, 2, "#4fd8eb", 0, 0.35) + rect(662, 124, 18, 2, "#4fd8eb", 0, 0.18);
  g += grid(["....cccc....", "..cccccccc..", "gggggggggggg", "..cc....cc.."], { c: "#4fd8eb", g: "#8ea3c9" }, 2, 596, 122);
  g += iconDot(608, 136, 4, "#4fd8eb") + rect(596, 138, 20, 2, "#4fd8eb", 0, 0.35);
  // title
  g += `<g filter="url(#tglow)" opacity="0.9">${pixelText("beingDurgesh", 440, 188, { s: 8, align: "center", color: "#8f6bff" }).svg}</g>`;
  g += pixelText("beingDurgesh", 440, 188, { s: 8, align: "center", color: "#f2f0ff" }).svg;
  g += iconCrown(423, 148, 3);
  // tagline
  g += pixelText("AI Engineer \u00b7 Data Analyst \u00b7 Reverse Engineering Enthusiast", 440, 272, { s: 2, align: "center", color: "#cbd3ff" }).svg;
  // quote box
  g += rect(198, 300, 484, 74, "#0a0f1f", 12, 0.72);
  g += `<rect x="198.75" y="300.75" width="482.5" height="72.5" rx="11" fill="none" stroke="#cbd3ff" stroke-opacity="0.5" stroke-width="1.5"/>`;
  g += ticks(198, 300, 484, 74, "#4fd8eb", 12, 2.5);
  g += pixelText("{ I break things to understand them,", 440, 316, { s: 2, align: "center", color: "#eef2ff" }).svg;
  g += pixelText("then build something better.. }", 440, 344, { s: 2, align: "center", color: "#eef2ff" }).svg;
  // breadcrumbs + version
  const crumbs = [["< code >", C.green], ["< data >", C.cyan], ["< explore >", C.green], ["< build >", C.cyan]];
  let bx = 26;
  crumbs.forEach(([t, col]) => {
    g += pixelText(t, bx, 16, { s: 1.5, color: col, sp: 1 }).svg;
    bx += measure(t, 1.5) + 16;
  });
  g += pixelText("Hybrid Universe v1.0", 856, 16, { s: 1.5, align: "right", color: C.cyan }).svg;
  // frame
  g = `<g clip-path="url(#round)">${g}</g>` +
    `<rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="15" fill="none" stroke="#2b3a55" stroke-opacity="0.7" stroke-width="1.5"/>`;
  return svgWrap(W, H, g, defs);
}

// ============================================================
//  PROFILE CARD
// ============================================================
function buildProfile() {
  const W = 340, H = 380, PW = 330;
  const defs = `<defs>
<radialGradient id="sunset" gradientUnits="userSpaceOnUse" cx="63" cy="78" r="34">
<stop offset="0" stop-color="#ffd08a"/><stop offset="0.6" stop-color="#ff8f62"/><stop offset="1" stop-color="#e0567a"/></radialGradient>
<clipPath id="avc"><rect x="22" y="26" width="82" height="82" rx="9"/></clipPath>
</defs>`;
  let g = panel(PW, H, C.green);
  // avatar
  g += rect(22, 26, 82, 82, "#101832");
  g += `<g clip-path="url(#avc)">
    <circle cx="63" cy="78" r="34" fill="url(#sunset)"/>
    ${rect(22, 92, 30, 12, "#2a2044")}${rect(42, 84, 26, 20, "#221a3c")}${rect(64, 90, 40, 14, "#2a2044")}
    ${rect(22, 101, 82, 7, "#101a2e")}
    ${boyStanding(44, 50, 3.2)}
  </g>`;
  g += `<rect x="22.75" y="26.75" width="80.5" height="80.5" rx="9" fill="none" stroke="#4fd8eb" stroke-opacity="0.6" stroke-width="1.5"/>`;
  // name + handle
  g += pixelText("Durgesh", 122, 34, { s: 3, color: C.text }).svg;
  g += iconCrown(252, 38, 2);
  g += iconDot(127, 80, 5, "#39d353") + iconDot(127, 80, 9, "rgba(57,211,83,0.25)");
  g += pixelText("beingDurgesh", 140, 74, { s: 2, color: "#cdd4ff" }).svg;
  // quote
  g += rect(20, 116, 290, 1.5, C.line, 0, 0.8);
  g += textBlock("I break things to understand them, then build something better..", 20, 130, 292, { s: 2, color: C.dim, lh: 22 });
  g += rect(20, 204, 290, 1.5, C.line, 0, 0.8);
  // contacts
  g += iconLinkedIn(20, 212, 20);
  g += textBlock("linkedin.com/in/dev-durgesh-shukla/", 52, 214, 260, { s: 1.5, color: "#cbd3ff", lh: 16 });
  g += iconX(20, 252, 20);
  g += pixelText("x.com/Durgesh0964", 52, 256, { s: 1.5, color: "#cbd3ff" }).svg;
  g += iconMail(20, 286, 20);
  g += pixelText("durgeshshukla964@gmail.com", 52, 289, { s: 1.5, color: "#cbd3ff" }).svg;
  // status bar
  g += rect(20, 322, 290, 1.5, C.line, 0, 0.8);
  g += iconDot(26, 352, 4, "#39d353");
  g += pixelText("online \u00b7 v1.0", 38, 346, { s: 1.5, color: C.mute }).svg;
  const dots = ["#4fd8eb", "#a78bfa", "#43e08d", "#ffc94d"];
  dots.forEach((c, i) => (g += rect(268 + i * 12, 346, 8, 8, c, 2, 0.85)));
  return svgWrap(W, H, g, defs);
}

// ============================================================
//  QUICK LINKS
// ============================================================
function buildQuickLinks() {
  const W = 505, H = 380;
  const x0 = 10, PW = 495;
  const rnd = mulberry32(77);
  let g = panel(PW, H, C.green, x0);
  // title
  g += iconTerminal(x0 + 20, 26, 2);
  g += pixelText("Quick Links", x0 + 52, 22, { s: 2.5, color: C.text }).svg;
  g += rect(x0 + 18, 58, 459, 1.5, C.line, 0, 0.8);
  // vertical divider + right panel art
  g += rect(x0 + 336, 58, 1.5, 296, C.line, 0, 0.8);
  const ax = x0 + 346, aw = 139;
  g += pixelText("Small", ax + 12, 84, { s: 1.5, color: "#cfd6ff" }).svg;
  g += pixelText("steps", ax + 12, 106, { s: 1.5, color: "#cfd6ff" }).svg;
  g += pixelText("build big", ax + 12, 128, { s: 1.5, color: "#cfd6ff" }).svg;
  g += pixelText("worlds.", ax + 12, 150, { s: 1.5, color: C.cyan }).svg;
  for (let i = 0; i < 14; i++) {
    g += rect(ax + 8 + rnd() * (aw - 16), 170 + rnd() * 60, 2, 2, rnd() < 0.6 ? "#9fd8ff" : "#ffd9a0", 0, 0.4 + rnd() * 0.5);
  }
  g += `<circle cx="${n(ax + 92)}" cy="196" r="24" fill="rgba(223,230,255,0.12)"/>`;
  g += `<circle cx="${n(ax + 92)}" cy="196" r="13" fill="#e7ecff"/>`;
  g += mountainRange(ax, ax + aw, 300, 22, 46, 14, "#241d45", rnd);
  g += mountainRange(ax, ax + aw, 300, 8, 26, 18, "#161d3a", rnd);
  g += rect(ax, 300, aw, 2, "#16203a");
  g += iconChest(ax + 34, 256, 2.2);
  g += iconSparkle(ax + 20, 240, 1.6, "#ffd54a") + iconSparkle(ax + 110, 252, 1.4, "#cfe3ff");
  g += pixelText("\u00b7 \u00b7 \u00b7 \u00b7", ax + aw / 2, 322, { s: 2, align: "center", color: C.mute }).svg;
  // rows
  const rows = [
    { icon: (x, y) => iconLinkedIn(x, y, 22), name: "LinkedIn", cta: "\u2192 Connect", ctaColor: C.green },
    { icon: (x, y) => iconX(x, y, 22), name: "X (Twitter)", cta: "\u2192 Follow", ctaColor: C.green },
    { icon: (x, y) => iconMail(x, y, 24), name: "Email", cta: "\u2192 Mail Me", ctaColor: C.green },
    { icon: (x, y) => iconTarget(x, y, 22), name: "Portfolio", cta: "Coming Soon", ctaColor: C.mute },
  ];
  rows.forEach((row, i) => {
    const cy = 58 + i * 74;
    if (i > 0) g += rect(x0 + 18, cy, 330, 1, C.line, 0, 0.5);
    g += row.icon(x0 + 30, cy + 26);
    g += pixelText(row.name, x0 + 66, cy + 28, { s: 2.5, color: C.text }).svg;
    g += pixelText(row.cta, x0 + 330, cy + 30, { s: 2, align: "right", color: row.ctaColor }).svg;
  });
  return svgWrap(W, H, g);
}

// ============================================================
//  SKILL INVENTORY
// ============================================================
function buildSkills() {
  const W = 880, H = 420;
  const defs = `<defs><linearGradient id="xp" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="#2dd4bf"/><stop offset="0.6" stop-color="#43e08d"/><stop offset="1" stop-color="#a7f3d0"/></linearGradient></defs>`;
  let g = panel(W, H, "#34d399");
  g += iconCog(30, 24, 2.2);
  g += pixelText("Skill Inventory", 64, 20, { s: 3, color: C.text }).svg;
  g += pixelText("Tools for the journey.", 64, 50, { s: 2, color: C.dim }).svg;
  g += rect(18, 78, 844, 1.5, C.line, 0, 0.8);
  const skills = [
    { label: "Python", w: 11 * 2.2, h: 14 * 2.2, icon: (x, y) => iconPython(x, y, 2.2) },
    { label: "Rust", w: 10 * 2.6, h: 8 * 2.6, icon: (x, y) => iconRust(x, y, 2.6) },
    { label: "C++", w: 11 * 2.4, h: 9 * 2.4, icon: (x, y) => iconHex(x, y, 2.4, "++") },
    { label: "SQL", w: 11 * 2.2, h: 10 * 2.2, icon: (x, y) => iconDB(x, y, 2.2) },
    { label: "C", w: 11 * 2.4, h: 9 * 2.4, icon: (x, y) => iconHex(x, y, 2.4, "C") },
    { label: "AI/ML", w: 10 * 2.4, h: 9 * 2.4, icon: (x, y) => iconBrain(x, y, 2.4) },
    { label: "Data Analysis", w: 8 * 2.2, h: 10 * 2.2, icon: (x, y) => iconChart(x, y, 2.2) },
    { label: "Reverse Engineering", w: 11 * 2.2, h: 11 * 2.2, icon: (x, y) => iconChip(x, y, 2.2) },
  ];
  const tw = 194.5, th = 108, gap = 22, sx = 18, sy = 96;
  skills.forEach((sk, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = sx + col * (tw + gap), y = sy + row * (th + gap);
    g += rect(x, y, tw, th, C.panel2, 10);
    g += `<rect x="${n(x + 0.75)}" y="${n(y + 0.75)}" width="${n(tw - 1.5)}" height="${n(th - 1.5)}" rx="9" fill="none" stroke="#34d399" stroke-opacity="0.22" stroke-width="1.5"/>`;
    const cxm = x + tw / 2;
    g += sk.icon(cxm - sk.w / 2, y + 38 - sk.h / 2);
    g += pixelText(sk.label, cxm, y + 82, { s: 1.5, align: "center", color: "#dfe7ff" }).svg;
  });
  // hearts + level
  for (let i = 0; i < 5; i++) g += iconHeart(30 + i * 30, 352, 3, i === 4);
  g += pixelText("Level 1 \u00b7 Keep Going!", 850, 356, { s: 1.5, align: "right", color: C.dim }).svg;
  g += rect(30, 386, 820, 16, "#101b30", 8);
  g += `<rect x="31.5" y="387.5" width="${n(817 * 0.62)}" height="13" rx="6.5" fill="url(#xp)"/>`;
  g += `<rect x="30.75" y="386.75" width="818.5" height="14.5" rx="7" fill="none" stroke="#2b3a55" stroke-width="1.5"/>`;
  return svgWrap(W, H, g, defs);
}

// ============================================================
//  GITHUB STATS (auto-refreshed by the workflow via data/stats.json)
// ============================================================
const LANG_COLORS = {
  Python: "#3572A5", JavaScript: "#f1e05a", TypeScript: "#3178c6", "C++": "#f34b7d",
  C: "#8a8a8a", Rust: "#dea584", Java: "#b07219", HTML: "#e34c26", CSS: "#563d7c",
  "Jupyter Notebook": "#DA5B0B", Shell: "#89e051", Go: "#00ADD8", Ruby: "#701516",
  Swift: "#F05138", Kotlin: "#A97BFF", "C#": "#178600", Dart: "#00B4AB", PHP: "#4F5D95",
  Lua: "#000080", Makefile: "#427819",
};
const DEMO_LANGS = [
  { name: "Python", color: "#3572A5", pct: 38 },
  { name: "C++", color: "#f34b7d", pct: 24 },
  { name: "Rust", color: "#dea584", pct: 16 },
  { name: "SQL", color: "#e38c00", pct: 12 },
  { name: "C", color: "#8a8a8a", pct: 10 },
];

function buildStreak(D) {
  const year = D && D.streak && D.streak.length
    ? new Date(D.streak[D.streak.length - 1].d + "T00:00:00Z").getUTCFullYear()
    : new Date().getUTCFullYear();
  const byDate = new Map();
  if (D && D.streak) D.streak.forEach((x) => byDate.set(x.d, x.l));
  const rnd = mulberry32(7);
  const cell = 4, gap = 1.7, step = cell + gap;
  const blockW = 6 * step - gap, blockGap = 6;
  const gridY = 490, monthY = 532;
  let cells = "", labels = "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let m = 0; m < 12; m++) {
    const bx = 34 + m * (blockW + blockGap);
    labels += pixelText(months[m], bx + blockW / 2, monthY, { s: 1, align: "center", color: C.mute }).svg;
    const days = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
    const firstDow = new Date(Date.UTC(year, m, 1)).getUTCDay();
    for (let d = 1; d <= days; d++) {
      const wk = Math.floor((d - 1 + firstDow) / 7);
      const dow = (d - 1 + firstDow) % 7;
      const key = `${year}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      let lvl = byDate.has(key) ? byDate.get(key) : -1;
      if (lvl === -1 && !byDate.size) lvl = rnd() < 0.14 ? 1 + Math.floor(rnd() * 3) : 0;
      const colors = ["rgba(148,163,199,0.13)", "#124f2e", "#1e7a45", "#2ea44f", "#5cf58f"];
      cells += rect(bx + wk * step, gridY + dow * step, cell, cell, colors[lvl] || colors[0], 1);
    }
  }
  return { cells, labels };
}

function buildStats(D) {
  const W = 545, H = 560, PW = 535;
  const accent = "#2dd4bf";
  const num = (v) => (v === undefined || v === null || v === "" ? "--" : String(v));
  let g = panel(PW, H, accent);
  g += iconChart(30, 26, 2.4);
  g += pixelText("GitHub Stats", 64, 20, { s: 3, color: C.text }).svg;
  g += textBlock("Numbers don't tell the whole story, but they show the journey.", 64, 50, 450, { s: 2, color: C.dim, lh: 22 });
  g += rect(18, 100, 499, 1.5, C.line, 0, 0.8);
  const boxes = [
    { x: 18, y: 118, label: "Total Repositories", sub: "Public", icon: (x, y) => iconFolder(x, y, 2.2), val: num(D && D.repos) },
    { x: 275.5, y: 118, label: "Total Commits", sub: "All time", icon: (x, y) => iconCommit(x, y, 2.2), val: num(D && D.commits) },
    { x: 18, y: 226, label: "Followers", sub: "Growing", icon: (x, y) => iconPeeps(x, y, 2.2), val: num(D && D.followers) },
    { x: 275.5, y: 226, label: "Following", sub: "Building", icon: (x, y) => iconFollow(x, y, 2.2), val: num(D && D.following) },
  ];
  boxes.forEach((b) => {
    g += rect(b.x, b.y, 241.5, 92, C.panel2, 10);
    g += `<rect x="${n(b.x + 0.75)}" y="${n(b.y + 0.75)}" width="240" height="90.5" rx="9" fill="none" stroke="${accent}" stroke-opacity="0.2" stroke-width="1.5"/>`;
    g += b.icon(b.x + 14, b.y + 12);
    g += pixelText(b.label, b.x + 64, b.y + 16, { s: 1.5, color: C.dim }).svg;
    const big = fitScale(b.val, 200, 5);
    g += pixelText(b.val, b.x + 14, b.y + 40, { s: big, color: C.text }).svg;
    g += pixelText(b.sub, b.x + 14, b.y + 76, { s: 1.5, color: C.mute }).svg;
  });
  // language breakdown
  const langs = D && D.languages && D.languages.length ? D.languages : DEMO_LANGS;
  const demo = !(D && D.languages && D.languages.length);
  g += rect(18, 334, 499, 92, C.panel2, 10);
  g += `<rect x="18.75" y="334.75" width="497.5" height="90.5" rx="9" fill="none" stroke="${accent}" stroke-opacity="0.2" stroke-width="1.5"/>`;
  g += pixelText("Language Breakdown", 34, 348, { s: 2, color: C.text }).svg;
  g += pixelText("More code. More possibilities.", 34, 370, { s: 1.5, color: C.mute }).svg;
  g += rect(34, 392, 467, 14, "#101b30", 7);
  g += `<clipPath id="lbar"><rect x="34" y="392" width="467" height="14" rx="7"/></clipPath>`;
  let lx = 34;
  const total = langs.reduce((a, b) => a + b.pct, 0) || 100;
  g += `<g clip-path="url(#lbar)">`;
  langs.forEach((l) => {
    const w = (467 * l.pct) / total;
    g += rect(lx, 392, w, 14, LANG_COLORS[l.name] || l.color || "#6b7899", 0, demo ? 0.45 : 0.95);
    lx += w;
  });
  g += `</g>`;
  // streak
  g += rect(18, 442, 499, 100, C.panel2, 10);
  g += `<rect x="18.75" y="442.75" width="497.5" height="98.5" rx="9" fill="none" stroke="${accent}" stroke-opacity="0.2" stroke-width="1.5"/>`;
  g += pixelText("Contribution Streak", 34, 452, { s: 2, color: C.text }).svg;
  g += pixelText("One day at a time.", 34, 474, { s: 1.5, color: C.mute }).svg;
  const st = buildStreak(D);
  g += st.cells + st.labels;
  if (D && D.updated) g += pixelText(`updated ${D.updated}`, 517, 548, { s: 1, align: "right", color: C.mute }).svg;
  else g += pixelText("awaiting first workflow run", 517, 548, { s: 1, align: "right", color: C.mute }).svg;
  return svgWrap(W, H, g);
}

// ============================================================
//  ACHIEVEMENTS
// ============================================================
function buildAchievements() {
  const W = 300, H = 560;
  const accent = "#f5b04c";
  let g = panel(290, H, accent, 10);
  g += iconTrophy(30, 22, 2.2);
  g += pixelText("Achievements", 62, 18, { s: 3, color: C.text }).svg;
  g += pixelText("Milestones on the journey.", 62, 50, { s: 1.5, sp: 0.5, color: C.dim }).svg;
  g += rect(26, 84, 254, 1.5, C.line, 0, 0.8);
  const items = [
    "Build my first AI model",
    "Complete a reverse engineering challenge",
    "Contribute to open source",
    "Learn something new every week",
    "Turn ideas into real projects",
    "Make an impact",
  ];
  let y = 104;
  items.forEach((it) => {
    const lines = wrapText(it, 218, 1.5, 0.5);
    g += iconBox(28, y - 3, 16);
    lines.forEach((ln, i) => {
      g += pixelText(ln, 56, y, { s: 1.5, sp: 0.5, color: "#cbd3ff" }).svg;
    });
    y += lines.length * 16 + 28;
  });
  g += rect(26, 448, 254, 1.5, C.line, 0, 0.8);
  g += iconStar(30, 468, 2.4);
  g += pixelText("More achievements", 62, 464, { s: 1.5, sp: 0.5, color: C.dim }).svg;
  g += pixelText("to unlock...", 62, 482, { s: 1.5, sp: 0.5, color: C.dim }).svg;
  g += rect(28, 514, 240, 10, "#101b30", 5);
  g += rect(29, 515, 238 * 0.35, 8, accent, 4, 0.8);
  return svgWrap(W, H, g);
}

// ============================================================
//  HIDDEN TREASURES (EASTER EGGS)
// ============================================================
function buildTreasures() {
  const W = 545, H = 330;
  const accent = "#f5b04c";
  const rnd = mulberry32(1234);
  let g = panel(535, H, accent);
  g += iconGift(30, 18, 2.2);
  g += pixelText("Hidden Treasures (Easter Eggs)", 64, 16, { s: 2.5, color: C.text }).svg;
  g += pixelText("Not everything is visible at first glance...", 64, 46, { s: 1.5, sp: 0.5, color: C.dim }).svg;
  g += rect(18, 72, 499, 1.5, C.line, 0, 0.8);
  const cards = [
    { icon: (x, y) => iconChest(x, y, 2.2), w: 26.4, text: "Find the secret chest in the README..." },
    { icon: (x, y) => iconTerminal(x, y, 2.4), w: 26.4, text: 'Type "surprise" in the terminal...' },
    { icon: (x, y) => iconStar(x, y, 2.4), w: 16.8, text: "Look closer at the pixel details..." },
  ];
  const cw = 155.7;
  cards.forEach((c, i) => {
    const x = 18 + i * (cw + 16);
    g += rect(x, 88, cw, 156, C.panel2, 10);
    g += `<rect x="${n(x + 0.75)}" y="88.75" width="${n(cw - 1.5)}" height="154.5" rx="9" fill="none" stroke="${accent}" stroke-opacity="0.2" stroke-width="1.5"/>`;
    const cx = x + cw / 2;
    g += c.icon(cx - c.w / 2, 104);
    wrapText(c.text, 132, 1.5, 0.5).forEach((ln, li) => {
      g += pixelText(ln, cx, 138 + li * 15, { s: 1.5, sp: 0.5, align: "center", color: "#cbd3ff" }).svg;
    });
  });
  // night scene strip
  for (let i = 0; i < 12; i++) g += rect(300 + rnd() * 220, 258 + rnd() * 30, 2, 2, "#cfe3ff", 0, 0.3 + rnd() * 0.5);
  g += `<circle cx="492" cy="276" r="24" fill="rgba(223,230,255,0.12)"/>`;
  g += `<circle cx="492" cy="276" r="11" fill="#e7ecff"/>`;
  g += grid(["......t......", ".....ttt.....", "....ttttt....", "...ttttttt...", "..ttttttttt..", ".ttttkkktttt.", "tttttkkkttttt", "ddddddddddddd"], { t: "#3d7a6a", k: "#0d1b18", d: "#16203a" }, 2, 330, 282);
  g += pine(392, 266, 38, 18, "#0b1a12", "#123027") + pine(420, 274, 30, 14, "#0d2016", "#164030") + pine(444, 280, 24, 12, "#0b1a12", "#123027");
  g += rect(18, 306, 499, 2, "#16203a");
  g += iconSparkle(360, 262, 1.4, "#ffd54a") + iconSparkle(470, 258, 1.2, "#cfe3ff");
  return svgWrap(W, H, g);
}

// ============================================================
//  GITHUB ACTIONS
// ============================================================
function buildActions() {
  const W = 300, H = 330;
  let g = panel(290, H, C.purple, 10);
  g += pixelText("GitHub Actions", 30, 18, { s: 2.5, color: C.text }).svg;
  g += iconOcto(248, 12, 2.2);
  g += textBlock("Auto-update stats. Keep the journey alive.", 30, 50, 200, { s: 1.5, sp: 0.5, color: C.dim, lh: 16 });
  g += rect(26, 88, 238, 1.5, C.line, 0, 0.8);
  // workflow file chip
  g += rect(26, 100, 238, 50, C.panel2, 8);
  g += `<rect x="26.75" y="100.75" width="236.5" height="48.5" rx="7" fill="none" stroke="${C.purple}" stroke-opacity="0.35" stroke-width="1.5"/>`;
  g += pixelText(".github/workflows/", 38, 108, { s: 1.5, sp: 0.5, color: "#cbd3ff" }).svg;
  g += pixelText("refresh-stats.yml", 38, 127, { s: 1.5, sp: 0.5, color: C.purple }).svg;
  // checklist
  const checks = [
    "Runs weekly (Mon, 00:00 UTC)",
    "Manual trigger available",
    "Uses GitHub token (stored as secret)",
  ];
  let y = 168;
  checks.forEach((c) => {
    const lines = wrapText(c, 208, 1.5, 0.5);
    g += iconCheck(28, y, 16);
    lines.forEach((ln, i) => g += pixelText(ln, 54, y + 1 + i * 16, { s: 1.5, sp: 0.5, color: "#cbd3ff" }).svg);
    y += lines.length * 16 + 18;
  });
  g += rect(26, 296, 238, 1.5, C.line, 0, 0.8);
  g += iconDot(32, 312, 4, "#39d353");
  g += pixelText("status: active", 44, 306, { s: 1.5, sp: 0.5, color: C.mute }).svg;
  return svgWrap(W, H, g);
}

// ============================================================
//  FOOTER
// ============================================================
function buildFooter() {
  const W = 880, H = 90;
  let g = "";
  g += pine(14, 42, 36, 16, "#0b1a12", "#123027") + pine(40, 52, 26, 12, "#0d2016", "#164030");
  g += pine(794, 40, 28, 13, "#0d2016", "#164030") + pine(818, 46, 24, 11, "#0b1a12", "#123027");
  for (let x = 76; x <= 180; x += 26) g += rect(x, 44, 14, 2.5, C.mute, 0, 0.55);
  for (let x = 690; x <= 796; x += 26) g += rect(x, 44, 14, 2.5, C.mute, 0, 0.55);
  g += iconRocket(196, 30, 1.6);
  g += iconRocket(658, 30, 1.6);
  g += pixelText("Same person \u00b7 Different worlds \u00b7 One journey", 440, 38, { s: 1.5, align: "center", color: "#cbd3ff" }).svg;
  g += iconSparkle(240, 20, 1.4) + iconSparkle(628, 18, 1.4);
  g += pixelText("beingDurgesh", 860, 72, { s: 1.5, align: "right", color: C.mute }).svg;
  return svgWrap(W, H, g);
}

// ============================================================
//  OUTPUT
// ============================================================
let D = null;
const statsPath = join(ROOT, "data", "stats.json");
if (existsSync(statsPath)) {
  try {
    D = JSON.parse(readFileSync(statsPath, "utf8"));
    console.log(`data/stats.json loaded (repos=${D.repos}, commits=${D.commits}, langs=${(D.languages || []).length}, streak=${(D.streak || []).length})`);
  } catch (e) {
    console.warn("could not parse data/stats.json:", e.message);
  }
} else {
  console.log("no data/stats.json - rendering placeholders (run scripts/update-stats.mjs to fill)");
}

const out = {
  "banner.svg": buildBanner(),
  "profile.svg": buildProfile(),
  "quicklinks.svg": buildQuickLinks(),
  "skills.svg": buildSkills(),
  "stats.svg": buildStats(D),
  "achievements.svg": buildAchievements(),
  "treasures.svg": buildTreasures(),
  "actions.svg": buildActions(),
  "footer.svg": buildFooter(),
};
for (const [name, content] of Object.entries(out)) {
  writeFileSync(join(ASSETS, name), content);
  console.log(`wrote assets/${name} (${(Buffer.byteLength(content) / 1024).toFixed(1)} KB)`);
}
console.log("all assets regenerated");

