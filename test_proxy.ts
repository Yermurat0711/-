import https from 'https';

async function checkUrl(url: string) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (e) => {
      resolve({ url, status: e.message });
    });
  });
}

async function main() {
  const result: any = await checkUrl('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Latin_letter_A.svg/960px-Latin_letter_A.svg.png'));
  console.log(`${result.status}`);
}
main();
