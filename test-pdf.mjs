async function test() {
  try {
    const pdfParseModule = await import("pdf-parse");
    console.log("Module:", Object.keys(pdfParseModule));
    console.log("Default:", typeof pdfParseModule.default);
    
    // Also try CommonJS require
    // const pdfParseReq = require("pdf-parse");
    // console.log("Require:", typeof pdfParseReq);
  } catch(e) {
    console.error(e);
  }
}
test();
