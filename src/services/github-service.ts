import fetch from 'node-fetch';

async function returnExternalGet(url) {
  const res = await fetch(url);
  const json = await res.json();
  return json;
}

export default returnExternalGet;
