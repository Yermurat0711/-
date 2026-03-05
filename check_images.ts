import fs from 'fs';
import https from 'https';

const data = fs.readFileSync('./src/data.ts', 'utf8');
const urls = [...data.matchAll(/"(https:\/\/[^"]+)"/g)].map(m => m[1]);

async function checkUrl(url: string) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (e) => {
      resolve({ url, status: e.message });
    });
  });
}

async function main() {
  for (const url of urls) {
    const result: any = await checkUrl(url);
    if (result.status !== 200 && result.status !== 302) {
      console.log(`BROKEN: ${result.status} - ${url}`);
    } else {
      console.log(`OK: ${result.status} - ${url}`);
    }
  }
}
main();
