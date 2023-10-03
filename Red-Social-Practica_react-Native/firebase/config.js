import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


const firebaseConfig = {
  apiKey: "AIzaSyD6GEZfdTwov6EsQou-haPRJnV2TkzIUvQ",
  authDomain: "foodshare-6c8ed.firebaseapp.com",
  projectId: "foodshare-6c8ed",
  storageBucket: "foodshare-6c8ed.appspot.com",
  messagingSenderId: "189006105552",
  appId: "1:189006105552:web:a21174b051c5214eac07d5",
  measurementId: "G-YHRJ87RV57",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export async function uploadFile(file) {
    const { uri, name, type } = file;
    const response = await fetch(uri);
    const blob = await response.blob();
  
    const uniqueId = v4();
    const storageRef = ref(storage, `images/${uniqueId}`);
    await uploadBytes(storageRef, blob);
  
    const url = await getDownloadURL(storageRef);
    return url;
  }
  