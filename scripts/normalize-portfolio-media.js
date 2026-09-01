const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'assets', 'images', 'portfolio');

const renames = [
  {
    dir: 'novavozdangola',
    map: [
      ['Captura de ecrã 2026-09-01 182743.png', '01-home.png'],
      ['Captura de ecrã 2026-09-01 182817.png', '02-conteudo.png'],
      ['Captura de ecrã 2026-09-01 184649.png', '03-inscricao.png'],
      ['Captura de ecrã 2026-09-01 184707.png', '04-producao.png'],
      ['WhatsApp_Image_2025-10-29_at_14.48.15_07f65ca7-removebg-preview.png', 'logo.png']
    ]
  },
  {
    dir: 'grupolmseres',
    map: [
      ['foto_de_capa.png', 'cover.png'],
      ['Captura de ecrã 2026-09-01 183313.png', '01.png'],
      ['Captura de ecrã 2026-09-01 183321.png', '02.png'],
      ['Captura de ecrã 2026-09-01 183355.png', '03.png'],
      ['Captura de ecrã 2026-09-01 183427.png', '04.png'],
      ['Captura de ecrã 2026-09-01 183544.png', '05.png'],
      ['Captura de ecrã 2026-09-01 183553.png', '06.png'],
      ['Captura de ecrã 2026-09-01 183711.png', '07.png'],
      ['Captura de ecrã 2026-09-01 183728.png', '08.png'],
      ['Captura de ecrã 2026-09-01 183744.png', '09.png'],
      ['Captura de ecrã 2026-09-01 183752.png', '10.png']
    ]
  },
  {
    dir: 'viladoamor',
    map: [
      ['Vila do Amor.png', 'hero.png'],
      ['Captura de ecrã 2026-09-01 184147.png', '01-screenshot.png']
    ]
  }
];

function findFile(dirPath, expectedName) {
  if (fs.existsSync(path.join(dirPath, expectedName))) {
    return expectedName;
  }

  const files = fs.readdirSync(dirPath);
  const normalizedExpected = expectedName.normalize('NFC').toLowerCase();

  return files.find(function (file) {
    return file.normalize('NFC').toLowerCase() === normalizedExpected;
  });
}

for (const group of renames) {
  const dirPath = path.join(root, group.dir);

  for (const [from, to] of group.map) {
    const sourceName = findFile(dirPath, from);
    if (!sourceName) {
      console.warn('Missing:', group.dir, from);
      continue;
    }

    const fromPath = path.join(dirPath, sourceName);
    const toPath = path.join(dirPath, to);
    if (fromPath !== toPath) {
      fs.renameSync(fromPath, toPath);
      console.log('Renamed', group.dir + '/' + sourceName, '->', to);
    }
  }
}

const vilaDir = path.join(root, 'viladoamor');
const vilaFiles = fs.readdirSync(vilaDir);
const videoFile = vilaFiles.find(function (file) {
  return file.toLowerCase().endsWith('.mp4');
});

if (videoFile && videoFile !== 'demo.mp4') {
  fs.renameSync(path.join(vilaDir, videoFile), path.join(vilaDir, 'demo.mp4'));
  console.log('Renamed', 'viladoamor/' + videoFile, '->', 'demo.mp4');
}
