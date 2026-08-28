const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = [
  'index.html',
  'services.html',
  'portfolio.html',
  'aboutUs.html',
  'contacts.html',
  path.join('partials', 'header.html'),
];

const spanRe = /<span class="material-symbols-outlined([^"]*)">([^<]+)<\/span>/g;

function sizeForClasses(classes) {
  if (classes.includes('service-card__icon')) return 36;
  if (classes.includes('nav__toggle-icon')) return 24;
  if (classes.includes('card__icon-feature') && !classes.includes('card__icon-deco')) return 24;
  if (classes.includes('card__icon-deco')) return 48;
  if (classes.includes('icon-sm')) return 16;
  if (classes.includes('icon-arrow')) return 16;
  return 24;
}

files.forEach(function (rel) {
  const filePath = path.join(root, rel);
  let html = fs.readFileSync(filePath, 'utf8');
  let count = 0;

  html = html.replace(spanRe, function (_match, classSuffix, iconName) {
    count += 1;
    const size = sizeForClasses(classSuffix);
    const classAttr = ('ui-icon' + classSuffix).trim();
    return (
      '<img class="' + classAttr + '" src="assets/icons/ui/' + iconName.trim() + '.svg" alt="" aria-hidden="true" width="' + size + '" height="' + size + '">'
    );
  });

  html = html.replace(/\s*<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols\+Outlined[^"]+" rel="stylesheet">\r?\n?/g, '');

  fs.writeFileSync(filePath, html);
  console.log(rel + ': replaced ' + count + ' icons');
});
