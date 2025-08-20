// @see https://firebase.google.com/docs/web/setup?hl=zh-cn
// 服务端Firebase配置 - 仅用于API路由

import { initializeApp, getApps, getApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase配置 - 服务端使用
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase for server-side use
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default app; 