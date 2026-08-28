const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const src = path.join(root, 'assets', 'images', 'pyre-brand-board.jpg');
const outDir = path.join(root, 'assets', 'images');

const crops = {
  'logo-mark.png': { left: 458, top: 44, width: 108, height: 118 },
  'logo-icon.png': { left: 418, top: 418, width: 88, height: 88 },
};

function removeGrayBackground(buffer, info) {
  const data = Buffer.from(buffer);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const neutral = Math.abs(r - g) < 18 && Math.abs(g - b) < 18;
    const lightGray = neutral && r >= 95 && r <= 215;
    const darkGray = neutral && r >= 40 && r < 95;

    if (lightGray || darkGray) {
      data[i + 3] = 0;
    }
  }

  return data;
}

async function exportWithTransparency(filename, region) {
  const { data, info } = await sharp(src)
    .extract(region)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const cleaned = removeGrayBackground(data, info);
  const target = path.join(outDir, filename);

  await sharp(cleaned, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .trim()
    .png()
    .toFile(target);

  console.log('Wrote', filename, region);
}

async function run() {
  if (!fs.existsSync(src)) {
    throw new Error('Source brand board missing: ' + src);
  }

  for (const [filename, region] of Object.entries(crops)) {
    await exportWithTransparency(filename, region);
  }

  const iconPath = path.join(outDir, 'logo-icon.png');
  const markPath = path.join(outDir, 'logo-mark.png');

  await sharp(markPath)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, 'favicon.png'));

  await sharp(markPath)
    .resize(180, 180, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, 'apple-touch-icon.png'));

  console.log('Done');
}

run().catch(function (error) {
  console.error(error);
  process.exit(1);
});
