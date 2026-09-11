import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Cloud Firestore with project-configured database ID
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Verification connection check
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'status'));
  } catch (err: any) {
    // Expected if doc doesn't exist, as long as network reachable
  }
}

// Auth Helpers
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function signInCitizenQuick(displayName?: string, emailOrPhone?: string) {
  try {
    const userCredential = await signInAnonymously(auth);
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });
    }
    return userCredential.user;
  } catch (error: any) {
    console.error('Citizen Quick Sign-In Error:', error);
    throw error;
  }
}

export async function logoutFirebase() {
  return signOut(auth);
}

export { app };
export type { FirebaseUser };
