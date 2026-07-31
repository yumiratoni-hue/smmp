import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyAAk57jsCeh3_p24roOcsNxrMfh6hyFBzU",
  authDomain: "smmpanel-a51a2.firebaseapp.com",
  projectId: "smmpanel-a51a2",
  storageBucket: "smmpanel-a51a2.firebasestorage.app",
  messagingSenderId: "673951588836",
  appId: "1:673951588836:web:10540023c3c8794799a7f1",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
