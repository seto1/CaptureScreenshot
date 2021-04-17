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
    url = url.trim();
    if (!url) continue;
    // コメント
    if (url.match(/^(#|\/\/)/)) {
        continue;
    }
    if (! url.match(/^https?:\/\//)) {
        console.log('[URL以外の文字列] ' + url);
        continue;
    }
    console.log(url);
    let screenshotPath = 'screenshot/' + nowText + '/' + encodeURIComponent(url) + '.png';
    await page.goto(url);
    await page.screenshot({ fullPage: true });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: screenshotPath, fullPage: true });
  }
  await context.close();
  await browser.close();
})();
