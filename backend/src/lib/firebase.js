const admin = require('firebase-admin');
const serviceAccount = require('../path-to-firebase-service-account.json');

// Initialize the Firebase Admin SDK with your credentials and storage bucket
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com',
});

// Get a reference to your storage bucket
const bucket = admin.storage().bucket();

// Function that uploads a file buffer to Firebase Storage
async function uploadFileToStorage(buffer, fileName, mimeType) {
  const file = bucket.file(fileName); // Create a file reference with the name
  await file.save(buffer, {
    contentType: mimeType,  // Tell storage what type of file this is
    public: true,           // Make it public so it can be accessed if needed
  });
  // Return the public URL of the uploaded file to be saved in metadata
  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}

module.exports = { uploadFileToStorage };
