import { auth } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  signOut
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

const ACTION_CODE_SETTINGS = {
  url: `${import.meta.env.VITE_APP_URL ?? 'http://localhost:5173'}/login?verified=1`,
  handleCodeInApp: false
};

export async function register(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(cred.user, ACTION_CODE_SETTINGS);
  await signOut(auth); // sign out immediately — must verify first
  return cred;
}

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  if (!cred.user.emailVerified) {
    await signOut(auth);
    const err = new Error('Email belum diverifikasi.');
    err.code = 'auth/email-not-verified';
    throw err;
  }
  return cred;
}

export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function logout() {
  return signOut(auth);
}
