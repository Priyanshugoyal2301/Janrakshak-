import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getFunctions, Functions, httpsCallable } from "firebase/functions";

export interface Shelter {
  shelter_id: string;
  name: string;
  lat: number;
  lon: number;
  capacity: number;
  available: number;
  status: "operational" | "closed" | "maintenance" | "unknown";
}

export interface RoadSegment {
  road_id: string;
  geojson: GeoJSON.Feature<GeoJSON.LineString>;
  status: "safe" | "blocked" | "risky";
  last_updated: number;
}

export interface RouteResult {
  route: {
    polyline: string;
    distance_km: number;
    duration_min: number;
    steps: string[];
  };
  warnings: string[];
  shelter?: {
    name: string;
    lat: number;
    lon: number;
    capacity_available: number;
    shelter_id?: string;
  };
}

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let functions: Functions | undefined;

export const getFirebase = () => {
  if (!app) {
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    } as const;

    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    functions = getFunctions(app);
  }
  return { app: app!, db: db!, functions: functions! };
};

// Cloud Functions
export const getSafeRouteFunction = () => {
  const { functions } = getFirebase();
  return httpsCallable(functions, 'getSafeRoute');
};

export const getNearestShelterFunction = () => {
  const { functions } = getFirebase();
  return httpsCallable(functions, 'getNearestShelter');
};


