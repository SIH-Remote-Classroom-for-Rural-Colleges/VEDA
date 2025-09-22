import admin from 'firebase-admin';
import serviceAccount from '../config/bott-ea536-firebase-adminsdk-fbsvc-6219651833.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'bott-ea536.appspot.com',
});

const bucket = admin.storage().bucket();

export async function uploadFileToStorage(buffer, fileName, mimeType) {
  const file = bucket.file(fileName);
  await file.save(buffer, {
    contentType: mimeType,
    public: true,
  });
  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}
