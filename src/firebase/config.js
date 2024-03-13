import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyD2hy6Lb12ipv9rNDvEF9dpCZS-hNUhhqA',
  authDomain: 'labchronicle.firebaseapp.com',
  projectId: 'labchronicle',
  storageBucket: 'labchronicle.appspot.com',
  messagingSenderId: '748234155873',
  appId: '1:748234155873:web:5fe66a9fc0cf0c3f6cc720'
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Conditionally initialize Firebase Auth for React Native or web
let auth;
if (Platform.OS === 'ios' || Platform.OS === 'android') {
  // React Native environment
  // Ensure you've imported initializeAuth, getReactNativePersistence, and AsyncStorage at the top
  const app = firebase.app();
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  // Web environment
  auth = firebase.auth();
}

export default firebase;