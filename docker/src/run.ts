import puppeteer = require('puppeteer');
import { auth } from 'google-auth-library';
import { Storage } from '@google-cloud/storage';
const stream = require('stream');

const run = async(url? :string) => {
  try {
    if (!url) {
      throw 'No URL!';
    }
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
    });

    const browser_version = await browser.version();
    console.log(`run: browser version: ${browser_version}`);
  
    const page = await browser.newPage();
    await page.on('console', async(c) => {
      console.log(`run: ${c.type()}: ${c.text()}`);
    });

    console.log(`run: open url: ${url}`);
    await page.goto(url);

    await page.waitFor(1000 * 5);
    const projectId = await auth.getProjectId();
    console.log(`run: projectId: ${projectId}`);
    const storage = new Storage();
    const bucket = storage.bucket('headless-chrome-images');
    const time = Date.now();
    const file = bucket.file(`${time}.png`);
    const buffer = await page.screenshot({fullPage: true});
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(file.createWriteStream())
      .on('error', (error: any) => console.log(`run: image error: ${JSON.stringify(error)}`))
      .on('finish', () => console.log(`run: image finish`));

    await page.waitFor(1000 * 60 * 1);

    browser.close();
    console.log(`run: close url: ${url}`);
  } catch(e) {
    console.log(e);
    throw e;
  }
}

if (process.argv[2]) {
  const url  = process.argv[2];
  console.log(`run: url: ${url}`);
  run(url);
} else {
  run();
}
