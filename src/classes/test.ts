import Constants from '../config/constants';
const axios = require('axios');

export class Test {
  public christiangraciaAPI_URL: string =
    'https://christiangracia-api.herokuapp.com';

  constructor() {}

  requestChristianGraciaAPI = async (
    url: string,
    method: string,
    data?: {},
  ) => {
    return axios({
      url: `${this.christiangraciaAPI_URL}${url}`,
      method,
      params: data,
      headers: {
        Accept: 'application/json',
      },
    });
  };
}
