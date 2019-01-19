import axios from 'axios';
import _config from '../environment.js';

class AuthService {
  constructor() {
    let baseEndpoint = _config.SERVER_BASE_ENDPOINT;
    this.loginEndpoint = baseEndpoint + '/login';
    this.createAccountEndpoint = baseEndpoint + '/createUser';
    this.logoutEndpoint = baseEndpoint + '/logout';
    this.uid = null;
    this.isUserLogin = false;
  }

  getUid() {
    if (this.uid) {
      return this.uid
    }
    const sessionUid = window.sessionStorage.getItem('ecmid');
    if (sessionUid) {
      this.uid = sessionUid
      return sessionUid
    }
    return false;
  }

  isLoggedIn() {
    return this.isUserLogin || window.sessionStorage.getItem('ecmid');
  }
  
  saveLocalUID(uid) {
    this.uid = uid;
    window.sessionStorage.setItem('ecmid', uid)
  }

  signUp(userData) {
    const self = this;
    return new Promise((resolve, reject) => {
      axios
        .post(self.createAccountEndpoint, userData)
        .then((response) => {
          console.log("inside signup: ", response);
          const responseData = response.data;
          if (!responseData) {
            reject();
          }
          this.saveLocalUID(responseData.uid);
          resolve({ uid: responseData.uid });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  login(userData) {
    const self = this;
    return new Promise((resolve, reject) => {
      axios
        .post(self.loginEndpoint, userData)
        .then((response) => {
          console.log("inside login: ", response);
          const responseData = response.data;
          if (!responseData) {
            reject();
          }
          this.saveLocalUID(responseData.uid);
          resolve({ uid: responseData.uid });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

}

export default AuthService;
