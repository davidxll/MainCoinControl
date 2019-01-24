const express = require('express')
const app = express()
const axios = require('axios')
const firebase = require('firebase')
const bodyParser = require('body-parser');
const admin = require("firebase-admin");
const firebaseKeys = require("./firebase-keys.js");
const apiEndpoint = 'https://api.coinmarketcap.com/v1/ticker'

firebase.initializeApp(firebaseKeys.fireConfig);
var adminApp = admin.initializeApp({
  credential: admin.credential.cert(firebaseKeys.adminKeys),
  databaseURL: "https://maincoinmanager.firebaseio.com"
});
const database = firebase.database();
const adminAuth = adminApp.auth();

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json')
  next();
}

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json());
app.use(allowCrossDomain);

function getPurchasesArrayFromFirebase(obj) {
  let purchases = [];
  if (obj) {
    Object.keys(obj).forEach(p => {
      purchases.push({id: p, ...obj[p]})
    })
  }
  return purchases
}

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

function getAllPurchases(request, response) {
  var uid = request.body.uid;
  database.ref('/purchases').child(uid).once('value').then(function(snapshot) {
    var data = snapshot.val();
    var formattedData = getPurchasesArrayFromFirebase(data)
    response.json(formattedData);
  })
  .catch(function(error) {
    console.log("Error getting purchases:", error);
    response.status(500).send(error)
  });
}

app.get('/marketProxy', getCurrencyMarket)

app.post('/purchases', getAllPurchases)

app.post('/addPurchase', function(request, response) {
  var uid = request.body.uid;
  var newPurchase = request.body.purchase;
  var purchaseRef = database.ref('/purchases/' + uid).push()
  var newId = purchaseRef.getKey()
  newPurchase.id = newId
  purchaseRef.set(newPurchase)
  response.send(newId)
})

app.post('/createUser', function(request, response) {
  var email = request.body.email;
  var password = request.body.password;
  var fullName = request.body.fullName;
  var tax = request.body.tax;
  var trickName = `${fullName || ''}-${tax}`;
  adminAuth.createUser({
    email,
    password,
    emailVerified: true,
    displayName: trickName,
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
    let uid = (userRecord.user && userRecord.user.uid) ? userRecord.user.uid : userRecord.uid;
    response.send({ uid });
  })
  .catch(function(error) {
    console.log("Error logging in:", error);
    response.status(403).send(error);
  });
})

app.post('/user', function(request, response) {
  var uid = request.body.uid;
  adminAuth.getUser(uid).then((userData) => {
    if (userData.displayName) {
      const [name, tax] = userData.displayName.split('-');
      const formattedUserData = {
        name: name.trim(),
        tax: +(tax.trim()),
      };
      response.send({userData: formattedUserData})
    }
    response.status(500).send({error: 'problems gathering user data'});
  })
  .catch(function(error) {
    console.log("Error getting user data:", error);
    response.status(403).send(error)
  });
})

app.post('/updatePurchase', function(request, response) {
  const updatedPurchase = request.body.purchase;
  const uid = request.body.uid;
  const id = updatedPurchase.id;
  var purchaseRef = database.ref('/purchases/').child(uid).child(id);
  purchaseRef.update(updatedPurchase);
  getAllPurchases(request, response);
})

app.post('/deletePurchase', function(request, response) {
  const id = request.body.purchaseId
  const uid = request.body.uid
  var purchaseRef = database.ref('/purchases').child(uid).child(id)
  purchaseRef.remove()
  getAllPurchases(request, response)
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
