async function test() {
  const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/Apple');
  const data = await res.json();
  console.log(data.original?.source);
}
test();
