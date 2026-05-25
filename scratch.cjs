const fs = require('fs');
const https = require('https');
const path = require('path');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (Status: ${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

const run = async () => {
  try {
    console.log("Downloading pdf.min.js...");
    await download(
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js",
      path.join(__dirname, "public", "pdf.min.js")
    );
    console.log("Downloading pdf.worker.min.js...");
    await download(
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js",
      path.join(__dirname, "public", "pdf.worker.min.js")
    );
    console.log("PDF.js assets downloaded successfully!");
  } catch (err) {
    console.error("Download failed:", err);
  }
};

run();
