import express = require('express');
import puppeteer = require('puppeteer');
const app = express();

app.get(['/', '/:keyword'], async (req: express.Request, res: express.Response) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });

  let url = 'https://www.google.com/';
  const keyword = req.params.keyword;
  if (keyword) {
    url = url + `search?q=${keyword}`;
  }
  const browser_version = await browser.version();
  console.log(`browser.version ${browser_version}`);

  const page = await browser.newPage();

  await res.type('html');
  await res.write('<html><body>')
  await page.on('console', async(c) => {
    console.log(`${c.type()}: ${c.text()}`);
    res.write(`${c.type()}: ${c.text()}`);
  });

  await page.goto(url);

  const img = await page.screenshot({encoding: 'base64', fullPage: true});
  await res.write(`<img src="data:image/png;base64,${img}" style="border-width:1px; border-style:dashed;">`);

  await res.write('<p>Hello World</p>');
  await res.write('</body></html>');
  await res.end();
  server.close(() => {
    console.log("Server Stopping...");
  });
});

const server = app.listen(3000);
console.log("Server Starting...");
