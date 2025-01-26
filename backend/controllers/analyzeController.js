const firebaseAdmin = require('firebase-admin');
const bucket = firebaseAdmin.storage().bucket();
const { analyzeAdData } = require('../utils/langChain'); // Example analysis function
const csvParser = require('../utils/csvParser'); // Example CSV parser utility

exports.analyzeFile = async (req, res) => {
  const { user } = req;  // Get user info from request
  const { filePath } = req.body;  // Get the file path from the request

  if (!filePath) {
    return res.status(400).send('File path is required');
  }

  // Load the file from Firebase Storage
  const file = bucket.file(filePath);

  try {
    // Download the file content (buffer) for analysis
    const [fileBuffer] = await file.download();

    // Parse the CSV file directly from the buffer
    const adData = await csvParser.parseCSVFromBuffer(fileBuffer);

    // Perform further analysis on the data
    const analysisResult = await analyzeAdData(adData);

    // Populate Keyword stats in the analysis result
    analysisResult.highPerformingKeywords = analysisResult.highPerformingKeywords.map((keyword) => {
      const keywordRow = adData.find((row) => row["Matched product "] === keyword.keyword);
      return {
        ...keyword,
        impressions: keywordRow ? keywordRow["Impressions"] : null,
        clicks: keywordRow ? keywordRow["Clicks"] : null,
        cost: keywordRow ? keywordRow["Spend(USD)"] : null,
        conversions: keywordRow ? keywordRow["Orders"] : null,
        revenue: keywordRow ? keywordRow["Sales(USD)"] : null,
        acos: keywordRow ? keywordRow["ACOS"] : null,
        roas: keywordRow ? keywordRow["ROAS"] : null,
      }
    });
    analysisResult.lowPerformingKeywords = analysisResult.lowPerformingKeywords.map((keyword) => {
      const keywordRow = adData.find((row) => row["Matched product "] === keyword.keyword);
      return {
        ...keyword,
        impressions: keywordRow ? keywordRow["Impressions"] : null,
        clicks: keywordRow ? keywordRow["Clicks"] : null,
        cost: keywordRow ? keywordRow["Spend(USD)"] : null,
        conversions: keywordRow ? keywordRow["Orders"] : null,
        revenue: keywordRow ? keywordRow["Sales(USD)"] : null,
        acos: keywordRow ? keywordRow["ACOS"] : null,
        roas: keywordRow ? keywordRow["ROAS"] : null,
      }
    });



    // Store the analysis result in Firestore
    const db = firebaseAdmin.firestore();
    const fileDocRef = db.collection('userFiles').doc(user.uid).collection('files').where('filePath', '==', filePath);

    // Update the file record with the analysis result
    const snapshot = await fileDocRef.get();
    if (!snapshot.empty) {
      snapshot.forEach(async (doc) => {
        await doc.ref.update({
          analysisResult: analysisResult,
          analysisTimestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
        });
      });
    }

    // Send response with analysis results
    res.json({
      message: 'File analysis complete and saved in Firestore',
      analysisResult: analysisResult,
    });
  } catch (error) {
    console.error('Error analyzing file:', error);
    res.status(500).send('Error analyzing file');
  }
};

exports.getReports = async (req, res) => {
  const { user } = req;  // Get user info from request

  // Retrieve all reports from Firestore
  const db = firebaseAdmin.firestore();
  const reportsRef = db.collection('userFiles').doc(user.uid).collection('files');

  try {
    const snapshot = await reportsRef.get();
    if (snapshot.empty) {
      return res.status(404).send('No reports found');
    }

    const reports = [];
    snapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    res.json(reports);
  } catch (error) {
    console.error('Error retrieving reports:', error);
    res.status(500).send('Error retrieving reports');
  }
}

exports.getRecentReports = async (req, res) => {
  const { user } = req;  // Get user info from request

  // Retrieve the 5 most recent reports from Firestore
  const db = firebaseAdmin.firestore();
  const reportsRef = db.collection('userFiles').doc(user.uid).collection('files')
    .orderBy('analysisTimestamp', 'desc')
    .limit(5);

  try {
    const snapshot = await reportsRef.get();
    if (snapshot.empty) {
      return res.status(404).send('No reports found');
    }

    const reports = [];
    snapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    res.json(reports);
  } catch (error) {
    console.error('Error retrieving recent reports:', error);
    res.status(500).send('Error retrieving recent reports');
  }
}

exports.getReport = async (req, res) => {
  const { user } = req;  // Get user info from request
  const { reportId } = req.params;  // Get the report ID from the request

  if (!reportId) {
    return res.status(400).send('Report ID is required');
  }

  // Retrieve the report from Firestore
  const db = firebaseAdmin.firestore();
  const reportRef = db.collection('userFiles').doc(user.uid).collection('files').doc(reportId);

  try {
    const doc = await reportRef.get();
    if (!doc.exists) {
      return res.status(404).send('Report not found');
    }

    const reportData = doc.data();
  } catch (error) {
    console.error('Error retrieving report:', error);
    res.status(500).send('Error retrieving report');
  }
}
