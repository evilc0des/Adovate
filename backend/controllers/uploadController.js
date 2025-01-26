const firebaseAdmin = require('firebase-admin');
const bucket = firebaseAdmin.storage().bucket();

exports.uploadFile = (req, res) => {
  const { file } = req;
  const { user } = req; // User info from the authMiddleware

  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  // Create a Firestore document to get the document ID
  const db = firebaseAdmin.firestore();
  const fileRecordRef = db.collection('userFiles').doc(user.uid).collection('files').doc();
  const fileRecordId = fileRecordRef.id;

  // Define the path in Firebase Storage to store the file (user-specific)
  const firebaseFilePath = `adData/${user.uid}/${fileRecordId}/${file.originalname}`;

  // Create a reference to the file in Firebase Storage
  const blob = bucket.file(firebaseFilePath);
  const blobStream = blob.createWriteStream();

  blobStream.on('finish', async () => {
    // File uploaded successfully to Firebase Storage
    const fileRecord = {
      filePath: firebaseFilePath,
      userId: user.uid,
      uploadTimestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
    };

    // Store the file record in Firestore under 'userFiles/{userId}'
    await fileRecordRef.set(fileRecord);

    res.json({
      message: 'File uploaded successfully to Firebase Storage',
      firebaseFilePath: firebaseFilePath,
    });
  });

  blobStream.on('error', (err) => {
    console.error('Error uploading file:', err);
    res.status(500).send('Error uploading file to Firebase Storage');
  });
  console.log(file.buffer);
  // Upload the file directly to Firebase Storage
  blobStream.end(file.buffer);  // Use the file buffer in memory
};
