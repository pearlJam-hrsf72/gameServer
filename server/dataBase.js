var firebase = require('firebase');

const config = {
  apiKey: 'AIzaSyAr-h45K0XxMQf2PzQdzVW8EJH7upLsxiI',
  authDomain: 'pearl-jam-19d32.firebaseapp.com',
  databaseURL: 'https://pearl-jam-19d32.firebaseio.com',
  storageBucket: 'pearl-jam-19d32.appspot.com'
}

const firebaseApp = firebase.initializeApp(config)

module.exports = firebaseApp.database();


