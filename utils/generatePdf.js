const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");

async function generatePaymentPDF(data) {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  const templatePath = path.join(__dirname, "../views/thanks.ejs");
  const html = await ejs.renderFile(templatePath, data);

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = generatePaymentPDF;
