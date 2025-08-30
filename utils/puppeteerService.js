const puppeteer = require("puppeteer");

async function generatePDFfromHTML(htmlContent, options = {}) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `<div></div>`,
    footerTemplate: `
      <div style="font-family:'Times New Roman'; font-size:8px; width:100%; text-align:right;">
        Page <span class="pageNumber"></span> of <span class="totalPages"></span>
      </div>`,
    margin: {
      top: "2 cm",
      bottom: "2 cm",
      left: "50px",
      right: "50px"
    },
    ...options,
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = { generatePDFfromHTML };
