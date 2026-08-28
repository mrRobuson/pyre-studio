const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const ImageTracer = require('imagetracerjs');

const root = path.join(__dirname, '..');
const brandBoard = path.join(root, 'assets', 'images', 'pyre-brand-board.jpg');
const sourcePng = path.join(root, 'assets', 'images', 'logo-source.png');
const svgOut = path.join(root, 'assets', 'images', 'logo.svg');

var TRACE_LONG_EDGE = 1024;

function isFlamePixel(r, g, b, a) {
  if (a < 20) return false;

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var warmth = r - b;

  return warmth > 18 && max - min > 16 && r > 70 && g > 35;
}

function keepLargestComponent(data, width, height) {
  var visited = new Uint8Array(width * height);
  var best = [];

  function idx(x, y) {
    return y * width + x;
  }

  function isOn(x, y) {
    return data[idx(x, y) * 4] > 127;
  }

  function floodFill(sx, sy) {
    var stack = [[sx, sy]];
    var pixels = [];

    while (stack.length) {
      var point = stack.pop();
      var x = point[0];
      var y = point[1];
      var id = idx(x, y);

      if (x < 0 || y < 0 || x >= width || y >= height) continue;
      if (visited[id] || !isOn(x, y)) continue;

      visited[id] = 1;
      pixels.push([x, y]);
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    return pixels;
  }

  for (var y = 0; y < height; y += 1) {
    for (var x = 0; x < width; x += 1) {
      if (!visited[idx(x, y)] && isOn(x, y)) {
        var component = floodFill(x, y);
        if (component.length > best.length) best = component;
      }
    }
  }

  var cleaned = Buffer.alloc(width * height * 4);

  best.forEach(function (point) {
    var i = idx(point[0], point[1]) * 4;
    cleaned[i] = 255;
    cleaned[i + 1] = 255;
    cleaned[i + 2] = 255;
    cleaned[i + 3] = 255;
  });

  return cleaned;
}

async function buildSource() {
  var raw = await sharp(brandBoard)
    .extract({ left: 414, top: 414, width: 96, height: 96 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  var mask = Buffer.alloc(raw.info.width * raw.info.height * 4);

  for (var i = 0; i < raw.data.length; i += 4) {
    var on = isFlamePixel(raw.data[i], raw.data[i + 1], raw.data[i + 2], raw.data[i + 3]) ? 255 : 0;
    mask[i] = on;
    mask[i + 1] = on;
    mask[i + 2] = on;
    mask[i + 3] = 255;
  }

  var cleaned = keepLargestComponent(mask, raw.info.width, raw.info.height);

  var tempTrimmed = path.join(root, 'assets', 'images', 'logo-trimmed-temp.png');

  await sharp(cleaned, {
    raw: {
      width: raw.info.width,
      height: raw.info.height,
      channels: 4,
    },
  })
    .trim()
    .png()
    .toFile(tempTrimmed);

  var meta = await sharp(tempTrimmed).metadata();
  var scale = TRACE_LONG_EDGE / Math.max(meta.width, meta.height);
  var targetWidth = Math.round(meta.width * scale);
  var targetHeight = Math.round(meta.height * scale);

  await sharp(tempTrimmed)
    .resize(targetWidth, targetHeight, {
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toFile(sourcePng);

  fs.unlinkSync(tempTrimmed);

  var traced = await sharp(sourcePng)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return {
    width: traced.info.width,
    height: traced.info.height,
    data: Array.from(traced.data),
  };
}

function extractMainPath(tracedSvg) {
  var paths = tracedSvg.match(/<path[^>]*d="([^"]+)"[^>]*>/g) || [];
  var best = '';
  var bestScore = 0;

  paths.forEach(function (entry) {
    var d = entry.match(/d="([^"]+)"/)[1];
    if (d.length > bestScore) {
      bestScore = d.length;
      best = d;
    }
  });

  if (!best) {
    throw new Error('No paths found while tracing logo');
  }

  return best;
}

async function run() {
  var imageData = await buildSource();
  var tracedSvg = ImageTracer.imagedataToSVG(imageData, {
    ltres: 0.08,
    qtres: 0.08,
    pathomit: 2,
    colorsampling: 0,
    numberofcolors: 2,
    mincolorratio: 0,
    colorquantcycles: 1,
    scale: 1,
    linefilter: true,
    blurradius: 0,
    blurdelta: 0,
    strokewidth: 0,
    viewbox: false,
    desc: false,
  });

  var pathData = extractMainPath(tracedSvg);
  var width = imageData.width;
  var height = imageData.height;

  var svg = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-label="Pyre Studio">`,
    '  <defs>',
    `    <linearGradient id="pyre-flame" x1="${Math.round(width * 0.12)}" y1="${height}" x2="${Math.round(width * 0.92)}" y2="${Math.round(height * 0.04)}" gradientUnits="userSpaceOnUse">`,
    '      <stop stop-color="#7A4212"/>',
    '      <stop offset="0.2" stop-color="#A65A14"/>',
    '      <stop offset="0.45" stop-color="#D97706"/>',
    '      <stop offset="0.68" stop-color="#E8943A"/>',
    '      <stop offset="0.86" stop-color="#F0B868"/>',
    '      <stop offset="1" stop-color="#FAEBD4"/>',
    '    </linearGradient>',
    '  </defs>',
    `  <path fill="url(#pyre-flame)" fill-rule="evenodd" d="${pathData}"/>`,
    '</svg>',
    '',
  ].join('\n');

  fs.writeFileSync(svgOut, svg);
  console.log('Wrote', svgOut, `(${width}x${height}, ratio ${(width / height).toFixed(3)})`);

  await sharp(sourcePng)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(root, 'assets', 'images', 'favicon.png'));

  await sharp(sourcePng)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(root, 'assets', 'images', 'apple-touch-icon.png'));
}

run().catch(function (error) {
  console.error(error);
  process.exit(1);
});
