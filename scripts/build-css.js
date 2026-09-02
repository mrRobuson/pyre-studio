const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cssDir = path.join(root, 'css');
const files = [
  'tokens.css',
  'fonts.css',
  'reset.css',
  'typography.css',
  'layout.css',
  'components.css',
  'performance.css',
  'utilities.css',
];

function minifyCss(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

const combined = files
  .map(function (file) {
    return fs.readFileSync(path.join(cssDir, file), 'utf8');
  })
  .join('\n');

const output = path.join(cssDir, 'main.min.css');
fs.writeFileSync(output, minifyCss(combined));
console.log('Built ' + output + ' (' + Math.round(fs.statSync(output).size / 1024) + ' KB)');
