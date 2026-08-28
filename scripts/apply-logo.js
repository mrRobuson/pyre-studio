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
  path.join('partials', 'footer.html'),
];

const headerBrand = `<a class="site-header__brand" href="index.html">
      <img alt="" class="site-header__logo" src="assets/images/logo-mark.png" width="36" height="36" aria-hidden="true">
      <span class="site-header__brand-text">
        <span class="site-header__name">Pyre</span>
        <span class="site-header__tagline">Studio</span>
      </span>
    </a>`;

const footerBrand = `<a class="site-footer__logo-link" href="index.html">
        <img alt="" class="site-footer__logo" src="assets/images/logo-mark.png" width="44" height="44" aria-hidden="true">
        <span class="site-footer__brand-text">
          <span class="site-header__name">Pyre</span>
          <span class="site-header__tagline">Studio</span>
        </span>
      </a>`;

const footerBrandCompact = `<a class="site-footer__logo-link" href="index.html">
      <img alt="" class="site-footer__logo" src="assets/images/logo-mark.png" width="44" height="44" aria-hidden="true">
      <span class="site-footer__brand-text">
        <span class="site-header__name">Pyre</span>
        <span class="site-header__tagline">Studio</span>
      </span>
    </a>`;

const replacements = [
  [
    '<link rel="icon" href="assets/images/logo.svg" type="image/svg+xml">',
    '<link rel="icon" href="assets/images/favicon.png" type="image/png">\n  <link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png">',
  ],
  [
    `<a class="site-header__brand" href="index.html">
      <img alt="Pyre Studio" class="site-header__logo site-header__logo--wordmark" src="assets/images/logo-full.png" width="148" height="56">
    </a>`,
    headerBrand,
  ],
  [
    `<a class="site-header__brand" href="index.html">
      <img alt="Pyre Flame Logo" class="site-header__logo" src="assets/images/logo.svg" width="32" height="32">
      <span class="site-header__name">Pyre</span>
    </a>`,
    headerBrand,
  ],
  [
    `<a class="site-footer__logo-link" href="index.html">
        <img alt="Pyre Studio" class="site-footer__logo site-footer__logo--wordmark" src="assets/images/logo-full.png" width="168" height="64">
      </a>`,
    footerBrand,
  ],
  [
    `<a class="site-footer__logo-link" href="index.html">
        <img alt="Pyre Flame Logo" class="site-footer__logo" src="assets/images/logo.svg" width="40" height="40">
        <span class="site-header__name">Pyre</span>
      </a>`,
    footerBrand,
  ],
  [
    `<a class="site-footer__logo-link" href="index.html">
      <img alt="Pyre Studio" class="site-footer__logo site-footer__logo--wordmark" src="assets/images/logo-full.png" width="168" height="64">
    </a>`,
    footerBrandCompact,
  ],
  [
    `<a class="site-footer__logo-link" href="index.html">
      <img alt="Pyre Flame Logo" class="site-footer__logo" src="assets/images/logo.svg" width="40" height="40">
      <span class="site-header__name">Pyre</span>
    </a>`,
    footerBrandCompact,
  ],
  [
    `<img alt="Pyre Studio" class="hero-logo" src="assets/images/logo-full.png" width="320" height="120">`,
    `<img alt="Pyre Studio" class="hero-logo" src="assets/images/logo-mark.png" width="144" height="144">`,
  ],
  [
    `<img alt="A stylized, glowing metallic copper flame emblem against a pure obsidian black background, rendering in high fidelity 3D style, luxury tech aesthetic, stark contrast." class="hero-logo" src="assets/images/logo.svg">`,
    `<img alt="Pyre Studio" class="hero-logo" src="assets/images/logo-mark.png" width="144" height="144">`,
  ],
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
  console.log(rel + ': ' + count + ' replacements');
});
