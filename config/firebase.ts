// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAbvzly2_cKXLf1qr0EiS9ES9ZZWYusFYg',
  authDomain: 'quapp-dff48.firebaseapp.com',
  projectId: 'quapp-dff48',
  storageBucket: 'quapp-dff48.appspot.com',
  messagingSenderId: '583570250250',
  appId: '1:583570250250:web:c039b7ef67535412665df3',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage(app)
