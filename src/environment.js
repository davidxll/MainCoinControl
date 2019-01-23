const config = {
  SERVER_BASE_ENDPOINT: 'https://main-coin-control.herokuapp.com',
}
if (process.env.NODE_ENV === 'development') {
  config.SERVER_BASE_ENDPOINT = 'http://localhost:5000';
}

export default config;