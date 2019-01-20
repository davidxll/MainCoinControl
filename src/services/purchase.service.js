import axios from 'axios';
import _config from '../environment.js';

function sanitizePurchase(data) {
  if(typeof data !== 'object') {
    console.log("purchase is Not an object! ", data)
    return null;
  }
  Object.values(data).forEach(val => {
    if (typeof val === 'function') {
      console.log("function in purchase! ", val)
      return null;
    }
  });
  return data;
}

class PurchaseService {
  constructor(authInstance) {
    let baseEndpoint = _config.SERVER_BASE_ENDPOINT
    // baseEndpoint = 'http://192.168.0.100:5000'
    this.uid = authInstance.getUid()
    this.endpoint = baseEndpoint;
    this.createEndpoint = baseEndpoint + '/addPurchase';
    this.updateEndpoint = baseEndpoint + '/updatePurchase';
    this.deleteEndpoint = baseEndpoint + '/deletePurchase';
    this.getAllEndpoint = baseEndpoint + '/purchases';
  }

  getAllPurchases() {
    const self = this;
    return new Promise((resolve, reject) => {
      axios
        .post(self.getAllEndpoint, {uid: this.uid})
        .then((response) => {
          const responseData = response.data;
          resolve({ purchases: responseData });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  deletePurchase(data) {
    const self = this;
    const payload = {purchaseId: data.id, uid: this.uid};
    return new Promise((resolve, reject) => {
      axios
        .post(self.deleteEndpoint, payload)
        .then((response) => {
          const responseData = response.data;
          resolve({ purchases: responseData });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  updatePurchase(data) {
    const self = this;
    const purchaseData = sanitizePurchase(data);
    const payload = {purchase: purchaseData, uid: this.uid}
    return new Promise((resolve, reject) => {
      if (!purchaseData || !payload.purchase.hasOwnProperty('id')) {
        alert('cannot update without a purchase ID');
        reject('missingId');
      }
      axios
        .post(self.updateEndpoint, payload)
        .then((response) => {
          const responseData = response.data;
          resolve({ purchases: responseData });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  createPurchase(data) {
    const self = this;
    const purchaseData = sanitizePurchase(data);
    const payload = {purchase: purchaseData, uid: this.uid}
    return new Promise((resolve, reject) => {
      axios
        .post(self.createEndpoint, payload)
        .then((response) => {
          const responseData = response.data;
          resolve({ id: responseData });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

}

export default PurchaseService;
