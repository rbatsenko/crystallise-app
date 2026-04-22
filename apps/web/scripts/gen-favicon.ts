import { createCanvas, loadImage } from "canvas";
import { writeFileSync } from "fs";
import { resolve } from "path";

async function main() {
  const logo = await loadImage(
    resolve("public/images/crystallise-logo-no-text.png")
  );

  // Generate 32x32 favicon
  const size = 32;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Cream background
  ctx.fillStyle = "#fdfbf7";
  ctx.fillRect(0, 0, size, size);

  // Draw logo scaled to fit
  const scale = Math.min(size / logo.width, size / logo.height) * 0.8;
  const w = logo.width * scale;
  const h = logo.height * scale;
  ctx.drawImage(logo, (size - w) / 2, (size - h) / 2, w, h);

  writeFileSync("src/app/favicon.ico", canvas.toBuffer("image/png"));

  // Also generate a proper 180x180 apple-touch-icon
  const appleSize = 180;
  const appleCanvas = createCanvas(appleSize, appleSize);
  const appleCtx = appleCanvas.getContext("2d");
  appleCtx.fillStyle = "#f5f0e8";
  appleCtx.fillRect(0, 0, appleSize, appleSize);
  const aScale = Math.min(appleSize / logo.width, appleSize / logo.height) * 0.75;
  const aW = logo.width * aScale;
  const aH = logo.height * aScale;
  appleCtx.drawImage(logo, (appleSize - aW) / 2, (appleSize - aH) / 2, aW, aH);
  writeFileSync("public/images/apple-touch-icon.png", appleCanvas.toBuffer("image/png"));

  console.log("Favicon and apple-touch-icon generated");
}

main();
