import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD4WNWTYkDl_FvcbnYbBkVgh76kgCmg4_o',
  authDomain: 'centersales-96145.firebaseapp.com',
  projectId: 'centersales-96145',
  storageBucket: 'centersales-96145.firebasestorage.app',
  messagingSenderId: '694131217651',
  appId: '1:694131217651:web:49604968a0d122fee35386',
  measurementId: 'G-G8JGZD0PH2',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
