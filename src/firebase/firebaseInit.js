import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // 匯入 Firestore 初始化函數

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: 'calendar-807b3.firebaseapp.com',
  projectId: 'calendar-807b3',
  storageBucket: 'calendar-807b3.appspot.com',
  messagingSenderId: '282481022284',
  appId: '1:282481022284:web:041f1127575b9b627aebe9'
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export default db;
