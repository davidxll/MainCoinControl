import axios from 'axios';
import _config from '../environment.js';

class MarketService {
  constructor() {
    this.endpoint = _config.SERVER_BASE_ENDPOINT + '/marketProxy';
  }

  loadData(limit = 0) {
    const self = this;
    return new Promise((resolve, reject) => {
      axios
        .get(`${self.endpoint}?limit=${limit}`)
        .then((response) => {
          console.log("inside loadData: ", response);
          const responseData = response.data;
          if (!responseData) {
            resolve({ market: [] });
          }
          resolve({ market: responseData });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

}

export default MarketService;
