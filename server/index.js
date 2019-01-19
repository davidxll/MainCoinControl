const express = require('express')
const app = express()
const axios = require('axios')
const firebase = require('firebase')
const bodyParser = require('body-parser');
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin-config.json");

const apiEndpoint = 'https://api.coinmarketcap.com/v1/ticker'

var fireConfig = {
  apiKey: "AIzaSyAZXrYA0ddCNy8d1Vg1iPZQK4q3hzdPy0g",
  authDomain: "maincoinmanager.firebaseapp.com",
  databaseURL: "https://maincoinmanager.firebaseio.com",
  projectId: "maincoinmanager",
  storageBucket: "maincoinmanager.appspot.com",
  messagingSenderId: "596811972788"
};

firebase.initializeApp(fireConfig)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://maincoinmanager.firebaseio.com"
});
const database = firebase.database()
const auth = admin.auth()

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

// firebase.auth().signInWithEmailAndPassword('pepe@gmail.com', '123456')

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json());
app.use(allowCrossDomain);

function getCurrencyMarket(request, response) {
  const limit = request.query.limit || 0;
  let endpoint = `${apiEndpoint}/?limit=${limit}`
  axios
  .get(endpoint)
  .then((markets) => {
    const marketsData = markets.data;
    console.log("request to: ", endpoint);
    response.json(marketsData);
  })
}

app.get('/marketProxy', getCurrencyMarket)

app.post('/createUser', function(request, response) {
  var email = request.body.email;
  var password = request.body.password;
  var name = request.body.name;
  admin.auth().createUser({
    email,
    password,
    emailVerified: true,
    displayName: name,
    disabled: false
  })
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    response.send({uid: userRecord.uid})
  })
  .catch(function(error) {
    console.log("Error creating new user:", error);
    response.status(403).send(error)
  });
})

app.post('/login', function(request, response) {
  var email = request.body.email;
  var password = request.body.password;
  firebase.auth().signInWithEmailAndPassword(email, password).then(userRecord => {
    response.send({uid: userRecord.uid})
  })
.catch(function(error) {
  console.log("Error logging in:", error);
  response.status(403).send(error)
});
})

app.post('/', function(request, response) {
  getCurrencyMarket(request, response)
})

app.get('/', function(request, response) {
  // console.log('admin', admin);
  response.send('greetings');
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
