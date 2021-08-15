import fetch from 'node-fetch';

async function returnExternalGet(url, requestOptions = {}) {
  const res = await fetch(url, requestOptions);
  const json = await res.json();
  return json;
}

export default returnExternalGet;
