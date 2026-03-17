import { createCanvas } from "canvas";
import { writeFileSync } from "fs";

const SIZE = 512;
const canvas = createCanvas(SIZE, SIZE);
const ctx = canvas.getContext("2d");

// Base cream color
ctx.fillStyle = "#f5f0e8";
ctx.fillRect(0, 0, SIZE, SIZE);

const imgData = ctx.getImageData(0, 0, SIZE, SIZE);
const data = imgData.data;

for (let i = 0; i < data.length; i += 4) {
  const x = (i / 4) % SIZE;
  const y = Math.floor(i / 4 / SIZE);

  // Soft tonal variations from overlapping sine waves
  const n1 = Math.sin(x * 0.02 + y * 0.015) * Math.cos(y * 0.025 - x * 0.01);
  const n2 = Math.sin(x * 0.05 + y * 0.04) * Math.cos(y * 0.06 + x * 0.03);
  const n3 = Math.sin(x * 0.12 + y * 0.08) * Math.cos(y * 0.1 - x * 0.07);

  // Fine random grain
  const grain = (Math.random() - 0.5) * 8;

  // Horizontal fiber streaks (like real paper pulp)
  const fiber =
    Math.sin(x * 0.3 + y * 0.02) * Math.cos(x * 0.15 + y * 0.005) * 3;

  const variation = n1 * 6 + n2 * 4 + n3 * 2 + grain + fiber;

  data[i] = Math.max(0, Math.min(255, data[i] + variation));
  data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + variation));
  data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + variation - 1));
}

ctx.putImageData(imgData, 0, 0);

// Scattered tiny specks — paper fibers and dust particles
for (let i = 0; i < 800; i++) {
  const x = Math.random() * SIZE;
  const y = Math.random() * SIZE;
  const w = Math.random() * 1.5 + 0.3;
  const h = w * (1 + Math.random() * 2);
  const opacity = Math.random() * 0.08 + 0.02;
  const dark = Math.random() > 0.5;
  ctx.fillStyle = dark
    ? `rgba(160, 140, 120, ${opacity})`
    : `rgba(100, 90, 80, ${opacity})`;
  ctx.fillRect(x, y, w, h);
}

const buffer = canvas.toBuffer("image/png");
writeFileSync("public/images/paper-texture.png", buffer);
console.log("Paper texture generated:", buffer.length, "bytes");
