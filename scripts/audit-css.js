const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cssPath = path.join(root, 'css', 'main.min.css');
const size = fs.statSync(cssPath).size;

console.log('CSS bundle: css/main.min.css');
console.log('Size: ' + Math.round(size / 1024) + ' KB (' + size + ' bytes)');
console.log('');
console.log('After editing css/*.css, run: npm run build:css');
