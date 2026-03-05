import https from 'https';

async function checkUrl(url: string) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url, status: res.statusCode, location: res.headers.location });
    }).on('error', (e) => {
      resolve({ url, status: e.message });
    });
  });
}

async function main() {
  const result: any = await checkUrl('https://loremflickr.com/600/600/dog');
  console.log(`${result.status} - ${result.location}`);
}
main();
