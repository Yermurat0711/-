import https from 'https';

const urls = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Latin_letter_A.svg/960px-Latin_letter_A.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/600px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Nursultan_Nazarbayev_2018-01-16.jpg/600px-Nursultan_Nazarbayev_2018-01-16.jpg"
];

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
  for (const url of urls) {
    const result: any = await checkUrl(url);
    console.log(`${result.status} - ${url}`);
  }
}
main();
