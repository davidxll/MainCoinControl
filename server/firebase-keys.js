require('dotenv').config();
const envVars = process.env;
const firebaseKeys = {
  adminKeys: {
    type: envVars.firebase_type,
    project_id: envVars.firebase_project_id,
    private_key_id: envVars.firebase_private_key_id,
    private_key: envVars.firebase_private_key.replace(/\\n/g, '\n'),
    client_email: envVars.firebase_client_email,
    client_id: envVars.firebase_client_id,
    auth_uri: envVars.firebase_auth_uri,
    token_uri: envVars.firebase_token_uri,
    auth_provider_x509_cert_url: envVars.firebase_auth_provider_x509_cert_url,
    client_x509_cert_url: envVars.firebase_client_x509_cert_url 
  },
  fireConfig: {
    apiKey: envVars.firebase_apiKey,
    authDomain: envVars.firebase_authDomain,
    databaseURL: envVars.firebase_databaseURL,
    projectId: envVars.firebase_projectId,
    storageBucket: envVars.firebase_storageBucket,
    messagingSenderId: envVars.firebase_messagingSenderId 
  }
}

module.exports = firebaseKeys;