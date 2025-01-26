const csv = require('csv-parser');
const fs = require('fs');
const { Readable } = require('stream');

// Parse CSV from a file path
exports.parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

// Parse CSV from a buffer (for use in memory)
exports.parseCSVFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const readable = Readable.from(buffer);
    readable.pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};
