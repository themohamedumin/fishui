// Firebase configuration — unchanged from the original app.
// Do not alter these values; they must match the Firebase project console
// and the ESP32 firmware's cloud path.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCAIEV765QGx5g-OtTwPlNujcAa4pJOkPk',
  authDomain: 'smartfishpond-4ed25.firebaseapp.com',
  databaseURL: 'https://smartfishpond-4ed25-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'smartfishpond-4ed25',
  storageBucket: 'smartfishpond-4ed25.firebasestorage.app',
  messagingSenderId: '1094231329137',
  appId: '1:1094231329137:web:22b1edaf151b5aefb00ed0',
};

export const DEVICE_ID = 'pond_02';

export const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getDatabase(app);
