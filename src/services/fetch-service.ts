import fetch from 'node-fetch';

const makeRequest = async (url: string, requestOptions = {}): Promise<any> => {
  const res = await fetch(url, requestOptions);
  const json = await res.json();
  return json;
};

export default makeRequest;
