import fetch from 'node-fetch';

/**
 * make request using node-fetch
 * @param { string } url - URL of request
 * @param { * } requestOptions - Optional options of request
 */
const makeRequest = async (url: string, requestOptions = {}): Promise<any> => {
  const res = await fetch(url, requestOptions);
  const json = await res.json();
  return json;
};

export default makeRequest;
