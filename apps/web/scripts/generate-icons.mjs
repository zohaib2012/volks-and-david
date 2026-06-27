import sharp from "sharp";
import fs from "fs";
import path from "path";

const sizes = [192, 512];
const svgPath = path.resolve("public/volksanddavid-logo.svg");
const outputDir = path.resolve("public");

const svgBuffer = fs.readFileSync(svgPath);
const svgContent = svgBuffer.toString();

async function generateIcons() {
  for (const size of sizes) {
    const bgSize = size;
    const logoSize = Math.round(size * 0.55);
    const offsetY = Math.round(size * 0.02);

    const svgWithBg = `
      <svg width="${bgSize}" height="${bgSize}" viewBox="0 0 ${bgSize} ${bgSize}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#21346E"/>
            <stop offset="100%" stop-color="#2a4a8a"/>
          </linearGradient>
        </defs>
        <rect width="${bgSize}" height="${bgSize}" rx="${Math.round(size * 0.18)}" fill="url(#bg)"/>
        <g transform="translate(${(bgSize - logoSize) / 2}, ${(bgSize - logoSize) / 2 + offsetY}) scale(${logoSize / 76.01})">
          <path fill="white" d="M42.08,5c5.27,0,9.99,2.73,12.63,7.29,2.64,4.57,2.64,10.02,0,14.59l-16.71,28.94L8.66,5h33.42ZM42.08,0H0l38,65.82,21.04-36.44c7.54-13.06-1.88-29.38-16.96-29.38"/>
          <path fill="#C8952E" d="M53.4,0c3.36,1.94,6.2,4.76,8.24,8.29,2.04,3.53,3.06,7.41,3.06,11.28L76.01,0h-22.6Z"/>
        </g>
      </svg>`;

    const outputPath = path.join(outputDir, `pwa-icon-${size}x${size}.png`);
    await sharp(Buffer.from(svgWithBg))
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`Generated: ${outputPath}`);
  }
}

generateIcons().catch(console.error);
