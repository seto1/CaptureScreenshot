const { chromium, devices } = require('playwright');
const fs = require('fs').promises;

let now = new Date();
let nowText =  now.getFullYear()
  + ('0' + (now.getMonth() + 1)).slice(-2)
  + ('0' + now.getDate()).slice(-2)
  + ('0' + now.getHours()).slice(-2)
  + ('0' + now.getMinutes()).slice(-2)
  + ('0' + now.getSeconds()).slice(-2);

(async () => {
  const text = await fs.readFile('url.txt', 'utf-8');
  const urls = text.split('\n');
  browser = await chromium.launch();
  context = await browser.newContext();
  const page = await context.newPage();
  for (let url of urls) {
    if (!url) continue;
    let screenshotPath = 'screenshot/' + nowText + '/' + encodeURIComponent(url) + '.png';
    console.log(url);
    await page.goto(url);
    await page.screenshot({ fullPage: true });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: screenshotPath, fullPage: true });
  }
  await context.close();
  await browser.close();
})();
