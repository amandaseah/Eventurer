import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function signUpWithEmail({ email, password, firstName, lastName, displayName }: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // set displayName if provided
  if (displayName || firstName || lastName) {
    try {
      await updateProfile(user, { displayName: displayName ?? `${firstName ?? ''} ${lastName ?? ''}`.trim() });
    } catch (e) {
      // ignore profile update failures
      console.warn('Failed to update profile displayName', e);
    }
  }

  // create user doc in Firestore
  try {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      firstName: firstName || null,
      lastName: lastName || null,
      displayName: user.displayName || null,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn('Failed to write user doc', e);
  }

  return user;
}

export async function signInWithEmail({ email, password }: { email: string; password: string }) {
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  return signInWithEmailAndPassword(auth, email, password);
}

export default null;
