const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const input = path.join(root, 'assets', 'images', 'Pyre-Studio_logo.svg');
const output = path.join(root, 'assets', 'images', 'logo.svg');

async function run() {
  var source = fs.readFileSync(input, 'utf8');
  var pathMatch = source.match(/\sd="([^"]+)"/);

  if (!pathMatch) {
    throw new Error('No path found in Pyre-Studio_logo.svg');
  }

  var pathData = pathMatch[1];
  var probe = await sharp(input).trim().png().toBuffer({ resolveWithObject: true });
  var probeInfo = probe.info;

  var fullMeta = await sharp(input).metadata();
  var scaleX = 595 / fullMeta.width;
  var scaleY = 842 / fullMeta.height;

  var offsetX = Math.abs(probeInfo.trimOffsetLeft || 0) * scaleX;
  var offsetY = Math.abs(probeInfo.trimOffsetTop || 0) * scaleY;
  var boxWidth = probeInfo.width * scaleX;
  var boxHeight = probeInfo.height * scaleY;

  var svg = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${boxWidth.toFixed(2)} ${boxHeight.toFixed(2)}" fill="none" role="img" aria-label="Pyre Studio">`,
    '  <defs>',
    '    <linearGradient id="pyre-flame" x1="0%" y1="100%" x2="100%" y2="0%">',
    '      <stop stop-color="#7A4212"/>',
    '      <stop offset="0.2" stop-color="#A65A14"/>',
    '      <stop offset="0.45" stop-color="#D97706"/>',
    '      <stop offset="0.68" stop-color="#E8943A"/>',
    '      <stop offset="0.86" stop-color="#F0B868"/>',
    '      <stop offset="1" stop-color="#FAEBD4"/>',
    '    </linearGradient>',
    '  </defs>',
    `  <g transform="translate(${(-offsetX).toFixed(2)} ${(-offsetY).toFixed(2)})">`,
    `    <path fill="url(#pyre-flame)" fill-rule="evenodd" d="${pathData}"/>`,
    '  </g>',
    '</svg>',
    '',
  ].join('\n');

  fs.writeFileSync(output, svg);

  await sharp(Buffer.from(svg))
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(root, 'assets', 'images', 'favicon.png'));

  console.log('Optimized logo.svg', `${boxWidth.toFixed(1)}x${boxHeight.toFixed(1)}`);
  console.log('Content pixels:', `${probeInfo.width}x${probeInfo.height}`);
}

run().catch(function (error) {
  console.error(error);
  process.exit(1);
});
