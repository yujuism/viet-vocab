import { writable } from 'svelte/store';
import { auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

// null = loading, false = not logged in, object = user
export const user = writable(null);
export const authLoading = writable(true);

onAuthStateChanged(auth, (firebaseUser) => {
  user.set(firebaseUser);
  authLoading.set(false);
});
