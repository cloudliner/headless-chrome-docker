import express = require('express');
import puppeteer = require('puppeteer');
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';
const app = express();

app.get('/', async function(req: express.Request, res: express.Response) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });
  const browser_version = await browser.version();
  console.log(`browser.version ${browser_version}`);

  const page = await browser.newPage();

  await res.type('html');
  await res.write('<html><body>')
  await page.on('console', async(c) => {
    console.log(`${c.type()}: ${c.text()}`);
    res.write(`${c.type()}: ${c.text()}`);
  });

  await page.goto('https://www.google.com/');

  const img = await page.screenshot({encoding: 'base64', fullPage: true});
  await res.write(`<img src="data:image/png;base64,${img}" style="border-width:1px; border-style:dashed;">`);

  await res.write('<p>Hello World</p>');
  await res.write('</body></html>');
  await res.end();
});

app.listen(3000);
console.log("Server Starting...");
