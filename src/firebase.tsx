import { initializeApp, getApps } from 'firebase/app';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

// Model
type FirebaseVideo = {
  id: string;
  title: string;
  thumbUrl: string;
  publishedAt: number; // timestamp em ms
  mediaUrl: string; // url do vídeo
};

// Read config from Vite env variables. Replace in .env with your Firebase config or set env vars in hosting.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let appInitialized = false;
let storage: ReturnType<typeof getStorage> | null = null;
let firestore: ReturnType<typeof getFirestore> | null = null;

function initIfPossible() {
  // ensure all required vars are present
  const ok = firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.storageBucket && firebaseConfig.appId;
  if (!ok) return false;
  if (getApps().length === 0) {
    try {
      initializeApp(firebaseConfig as any);
    } catch (e) {
      console.warn('Firebase initializeApp failed', e);
      return false;
    }
  }
  try {
    storage = getStorage();
    firestore = getFirestore();
    appInitialized = true;
    return true;
  } catch (e) {
    console.warn('Firebase services init failed', e);
    return false;
  }
}

export async function uploadVideoBlob(id: string, blob: Blob, contentType = 'video/webm') {
  if (!appInitialized) initIfPossible();
  if (!storage) throw new Error('Firebase Storage not initialized');
  const ref = storageRef(storage, `videos/${id}`);
  const metadata = { contentType };
  await uploadBytes(ref, blob, metadata);
  return getDownloadURL(ref);
}

export async function uploadDataUrlAsFile(id: string, dataUrl: string, ext = 'png') {
  if (!appInitialized) initIfPossible();
  if (!storage) throw new Error('Firebase Storage not initialized');
  // convert dataURL to blob
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const ref = storageRef(storage, `thumb/${id}.${ext}`);
  await uploadBytes(ref, blob);
  return getDownloadURL(ref);
}

export async function saveVideoMetadata(item: FirebaseVideo) {
  if (!appInitialized) initIfPossible();
  if (!firestore) throw new Error('Firestore not initialized');
  const col = collection(firestore, 'videos');
  await addDoc(col, item as any);
}

export async function fetchVideosFromFirestore(): Promise<FirebaseVideo[]> {
  if (!appInitialized) initIfPossible();
  if (!firestore) throw new Error('Firestore not initialized');
  const col = collection(firestore, 'videos');
  const q = query(col, orderBy('publishedAt', 'desc'));
  const snap = await getDocs(q);
  const out: FirebaseVideo[] = [];
  snap.forEach(d => {
    const data = d.data() as any;
    out.push({
      id: data.id || d.id,
      title: data.title || '',
      thumbUrl: data.thumbUrl || data.thumb || '',
      publishedAt: data.createdAt || Date.now(),
      mediaUrl: data.mediaUrl || data.media || ''
    });
  });
  return out;
}

export function firebaseAvailable() {
  return initIfPossible();
}
