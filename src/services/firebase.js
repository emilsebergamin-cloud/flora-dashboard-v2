import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBlZbljf0nXmFrS8pT9Hhmqb9RmAl4mir4',
  authDomain: 'flora-dashboard-117ce.firebaseapp.com',
  projectId: 'flora-dashboard-117ce',
  storageBucket: 'flora-dashboard-117ce.firebasestorage.app',
  messagingSenderId: '1025407296939',
  appId: '1:1025407296939:web:7e9180e145dd40c92e5eee',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const DASHBOARD_DOC_PATH = { collection: 'dashboards', doc: 'flora' };
