const express = require('express');
const cors = require('cors');
const firebaseAdmin = require('firebase-admin');
const multer = require('multer');

// Initialize Firebase Admin
const serviceAccount = require('./service-account.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
});

const uploadController = require('./controllers/uploadController');
const analyzeController = require('./controllers/analyzeController');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

// Allow CORS
const corsOptions = {
  origin: 'http://localhost:3001',  
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Use CORS middleware
app.use(cors(corsOptions));

const upload = multer({ storage: multer.memoryStorage() });

// Middlewares
app.use(express.json());

// Routes
app.post('/upload', authMiddleware, upload.single('file'), uploadController.uploadFile);
app.post('/analyze', authMiddleware, analyzeController.analyzeFile);
app.get('/reports', authMiddleware, analyzeController.getReports);
app.get('/reports/recent', authMiddleware, analyzeController.getRecentReports);
app.get('/reports/:reportId', authMiddleware, analyzeController.getReport);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
