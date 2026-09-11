import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  writeBatch,
  Firestore,
  Unsubscribe,
  updateDoc,
  arrayUnion,
  increment,
} from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { District, CompletedSando } from '../types';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// User's official Firebase configuration
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: 'AIzaSyA4h5OssGt1SExUChRj46X084qdVcZdzis',
  authDomain: 'toqn-fruitsando.firebaseapp.com',
  projectId: 'toqn-fruitsando',
  storageBucket: 'toqn-fruitsando.firebasestorage.app',
  messagingSenderId: '866480841714',
  appId: '1:866480841714:web:7152c07bb3212ca970c16b',
  measurementId: 'G-617MXK8094',
};

const STORAGE_KEY = 'fruit_sando_firebase_config';

export function getSavedFirebaseConfig(): FirebaseConfig {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (parsed && parsed.projectId) return parsed;
    } catch {
      // ignore
    }
  }

  // Fallback to Vite env variables if present
  if (import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
      appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
    };
  }

  // Default to provided Firebase configuration
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveFirebaseConfig(config: FirebaseConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function clearFirebaseConfig() {
  localStorage.removeItem(STORAGE_KEY);
}

class FirebaseService {
  private app: FirebaseApp | null = null;
  private db: Firestore | null = null;
  private unsubscribe: Unsubscribe | null = null;

  init(customConfig?: FirebaseConfig | null): boolean {
    const config = customConfig || getSavedFirebaseConfig();
    if (!config || !config.projectId || !config.apiKey) {
      return false;
    }

    try {
      if (getApps().length > 0) {
        this.app = getApps()[0];
      } else {
        this.app = initializeApp(config);
      }
      this.db = getFirestore(this.app);

      // Initialize analytics safely if supported in browser
      if (typeof window !== 'undefined') {
        isSupported().then((yes) => {
          if (yes && this.app) {
            getAnalytics(this.app);
          }
        }).catch(() => {
          // ignore
        });
      }

      return true;
    } catch (err) {
      console.error('Firebase initialization error:', err);
      return false;
    }
  }

  isReady(): boolean {
    return this.db !== null;
  }

  // Realtime subscription to all 30 districts
  subscribeDistricts(
    onData: (districts: District[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    if (!this.db) {
      const initialized = this.init();
      if (!initialized || !this.db) {
        return () => {};
      }
    }

    if (this.unsubscribe) {
      this.unsubscribe();
    }

    const colRef = collection(this.db, 'districts');

    this.unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          onData([]);
          return;
        }

        const districts: District[] = [];
        snapshot.forEach((docSnap) => {
          districts.push(docSnap.data() as District);
        });

        // Natural sort by team and sub (1-1, 1-2, ..., 6-5)
        districts.sort((a, b) => {
          const [teamA, subA] = a.id.split('-').map(Number);
          const [teamB, subB] = b.id.split('-').map(Number);
          if (teamA !== teamB) return teamA - teamB;
          return subA - subB;
        });

        onData(districts);
      },
      (err) => {
        console.error('Firestore snapshot error:', err);
        if (onError) onError(err);
      }
    );

    return this.unsubscribe;
  }

  // Seed / batch write all initial 30 districts to Firestore
  async seedDistricts(districts: District[]) {
    if (!this.db) {
      if (!this.init()) return;
    }
    if (!this.db) return;

    const batch = writeBatch(this.db);
    for (const d of districts) {
      const docRef = doc(this.db, 'districts', d.id);
      batch.set(docRef, d, { merge: true });
    }
    await batch.commit();
  }

  // Add points to a district in real-time
  async addPoints(districtId: string, addedPoints: number, currentPoints: number) {
    if (!this.db) {
      if (!this.init()) return;
    }
    if (!this.db) return;

    const docRef = doc(this.db, 'districts', districtId);
    await updateDoc(docRef, {
      points: increment(addedPoints),
      currentPoints: currentPoints + addedPoints,
    });
  }

  // Save a completed sando to a district in real-time
  async completeSando(districtId: string, sando: CompletedSando, remainingCurrent: number) {
    if (!this.db) {
      if (!this.init()) return;
    }
    if (!this.db) return;

    const docRef = doc(this.db, 'districts', districtId);
    await updateDoc(docRef, {
      currentPoints: remainingCurrent,
      completedSandos: arrayUnion(sando),
    });
  }

  // Reset all districts in Firestore
  async resetAll(freshDistricts: District[]) {
    if (!this.db) {
      if (!this.init()) return;
    }
    if (!this.db) return;

    const batch = writeBatch(this.db);
    for (const d of freshDistricts) {
      const docRef = doc(this.db, 'districts', d.id);
      batch.set(docRef, d);
    }
    await batch.commit();
  }
}

export const firebaseService = new FirebaseService();
