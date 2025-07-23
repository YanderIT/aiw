import admin from "firebase-admin";

if (!admin.apps.length) {
  // console.log("Initializing Firebase Admin with config:", {
  //   projectId: process.env.FIREBASE_PROJECT_ID,
  //   clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? "***" + process.env.FIREBASE_CLIENT_EMAIL.slice(-10) : "undefined",
  //   privateKey: process.env.FIREBASE_PRIVATE_KEY ? "defined" : "undefined",
  // });
  
  // 检查必要的环境变量
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    console.error("Missing required Firebase Admin environment variables");
    throw new Error("Firebase Admin configuration incomplete");
  }
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const firebaseAdmin = admin; 