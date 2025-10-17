import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Direct Firebase configuration for internal use
const firebaseConfig = {
  apiKey: "AIzaSyAxnqpzKhq_Br1gqdVzkE98u8KJaREiDSQ",
  authDomain: "tssc-prize-competition.firebaseapp.com",
  projectId: "tssc-prize-competition",
  storageBucket: "tssc-prize-competition.firebasestorage.app",
  messagingSenderId: "712293395339",
  appId: "1:712293395339:web:17a5f8b7f5bc9af7db1d8e",
  measurementId: "G-WVS8XX9QXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;