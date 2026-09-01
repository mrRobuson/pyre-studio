import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '..', 'assets', 'images', 'portfolio');

const projects = [
  { slug: 'nova-voz', url: 'https://novavozdangola.ao/' },
  { slug: 'lm-seres', url: 'https://lmseres.ao/' },
  { slug: 'vila-amor', url: 'https://viladoamor.ao/' }
];

const viewports = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 }
};

async function main() {
  let playwright;

  try {
    playwright = await import('playwright');
  } catch (error) {
    console.error('Playwright não está instalado.');
    console.error('Corre: npm install -D playwright && npx playwright install chromium');
    process.exit(1);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  for (const project of projects) {
    for (const [label, viewport] of Object.entries(viewports)) {
      const filename = `${project.slug}-${label}.jpg`;
      const filepath = path.join(outputDir, filename);

      await page.setViewportSize(viewport);
      await page.goto(project.url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: filepath, type: 'jpeg', quality: 82, fullPage: false });

      console.log('Guardado', path.relative(process.cwd(), filepath));
    }
  }

  await browser.close();
  console.log('Capturas concluídas.');
}

main().catch(function (error) {
  console.error(error);
  process.exit(1);
});
