#!/usr/bin/env node
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

const THEMES_TO_CHECK = [
  'tc_001-sp',
  'tc_001-fun88vip-dark',
  'tc_001-fun88vip-light',
  'tc_001-gd',
  'tc_001-bk8uk-light',
  'tc_002-mt',
  'tc_003-pg',
  'tc_005-69',
  'tc_006-md',
  'tc_007-star',
  'tc_008-mya777',
  'tc_010-viking888',
  'tc_011-fw8',
  'tc_011-kc66',
  'tc_012-5pin-light',
  'tc_013-sfc',
  'tc_013-lucksparkh',
  'tc_015-w98',
  'jw-jeetwin-dark',
  'si-siam99-dark',
  'bv-betvisa2-dark',
];

(async () => {
  const outDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const indexUrl = 'file://' + path.join(__dirname, 'index.html');
  const historyUrl = 'file://' + path.join(__dirname, 'history.html');

  for (const theme of THEMES_TO_CHECK) {
    console.log(`Capturing ${theme}...`);

    // Index page
    await page.goto(indexUrl, { waitUntil: 'load' });
    await page.selectOption('#themeSwitcher', theme);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, `${theme}-index.png`), fullPage: true });

    // History page
    await page.goto(historyUrl, { waitUntil: 'load' });
    // Close win modal first
    const closeBtn = await page.$('#congratsModalClose');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(200);
    await page.selectOption('#themeSwitcher', theme);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, `${theme}-history.png`), fullPage: true });
  }

  await browser.close();
  console.log(`Done! ${THEMES_TO_CHECK.length} themes captured to ./screenshots/`);
})();
