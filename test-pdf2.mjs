import { PDFParse } from "pdf-parse";
import fs from "fs";

async function test() {
  try {
    const buffer = fs.readFileSync("public/pdf.worker.min.js"); // just dummy buffer
    console.log(typeof PDFParse);
    // const data = await PDFParse(buffer);
  } catch(e) {
    console.error(e);
  }
}
test();
