const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = [
  'index.html',
  'services.html',
  'portfolio.html',
  'aboutUs.html',
  'contacts.html',
  path.join('partials', 'footer.html'),
];

const replacements = [
  ['<a href="#" aria-label="Instagram">', '<a href="https://www.instagram.com/pyre.studio" aria-label="Instagram" target="_blank" rel="noopener noreferrer">'],
  ['<a href="#" aria-label="Facebook">', '<a href="https://www.facebook.com/pyre.studio" aria-label="Facebook" target="_blank" rel="noopener noreferrer">'],
  ['<a href="#" aria-label="TikTok">', '<a href="https://www.tiktok.com/@pyre.studio" aria-label="TikTok" target="_blank" rel="noopener noreferrer">'],
  ['<a href="#" aria-label="LinkedIn">', '<a href="https://www.linkedin.com/company/pyre-studio" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">'],
  ['<a href="#" aria-label="GitHub">', '<a href="https://github.com/pyre-studio" aria-label="GitHub" target="_blank" rel="noopener noreferrer">'],
  ['<a class="social-link" href="#" aria-label="Instagram">', '<a class="social-link" href="https://www.instagram.com/pyre.studio" aria-label="Instagram" target="_blank" rel="noopener noreferrer">'],
  ['<a class="social-link" href="#" aria-label="Facebook">', '<a class="social-link" href="https://www.facebook.com/pyre.studio" aria-label="Facebook" target="_blank" rel="noopener noreferrer">'],
  ['<a class="social-link" href="#" aria-label="TikTok">', '<a class="social-link" href="https://www.tiktok.com/@pyre.studio" aria-label="TikTok" target="_blank" rel="noopener noreferrer">'],
  ['<a class="social-link" href="#" aria-label="LinkedIn">', '<a class="social-link" href="https://www.linkedin.com/company/pyre-studio" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">'],
  ['<a class="social-link" href="#" aria-label="GitHub">', '<a class="social-link" href="https://github.com/pyre-studio" aria-label="GitHub" target="_blank" rel="noopener noreferrer">'],
  ['<a class="social-link" href="#" aria-label="Website">', '<a class="social-link" href="https://pyre.studio" aria-label="Website" target="_blank" rel="noopener noreferrer">'],
];

files.forEach(function (rel) {
  const filePath = path.join(root, rel);
  let html = fs.readFileSync(filePath, 'utf8');
  let count = 0;

  replacements.forEach(function (pair) {
    const parts = html.split(pair[0]);
    if (parts.length > 1) {
      count += parts.length - 1;
      html = parts.join(pair[1]);
    }
  });

  fs.writeFileSync(filePath, html);
  console.log(rel + ': updated ' + count + ' social links');
});
