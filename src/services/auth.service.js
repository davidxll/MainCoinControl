import axios from 'axios';
import _config from '../environment.js';

class AuthService {
  constructor() {
    let baseEndpoint = _config.SERVER_BASE_ENDPOINT;
    this.loginEndpoint = baseEndpoint + '/login';
    this.createAccountEndpoint = baseEndpoint + '/createUser';
    this.logoutEndpoint = baseEndpoint + '/logout';
    this.userDataEndpoint = baseEndpoint + '/user';
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

  getUserData() {
    const self = this;
    const uid = this.uid || window.sessionStorage.getItem('ecmid');
    if (!this.isLoggedIn()) {
      return Promise.reject('Not logged in');
    }
    return new Promise((resolve, reject) => {
      axios
        .post(self.userDataEndpoint, {uid})
        .then((response) => {
          console.log("inside userData: ", response);
          const responseData = response.data;
          if (!responseData || !responseData.userData) {
            reject('no user data');
          }
          resolve(responseData.userData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  
  saveLocalUID(uid) {
    this.uid = uid;
    if (uid) {
      window.sessionStorage.setItem('ecmid', uid);
    }
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

  logout() {
    this.uid = null;
    window.sessionStorage.removeItem('ecmid');
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
