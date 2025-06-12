const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const FormSubmission = require("../model/form100model");
const { sendPdfToUser } = require("../emailService/formMail");

const generateForm100PDF = async (data) => {
  const {
    petitionNumber = "",
    deceasedName = "",
    deceasedAddress = "",
    deceasedOccupation = "",
    petitionerName = "",
    property = 0
  } = data;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: "Times New Roman", serif;
      font-size: 12px;
      margin: 60px;
    }
    .center {
      text-align: center;
    }
    .right {
      text-align: right;
    }
    .bold {
      font-weight: bold;
    }
    hr {
      border: none;
      border-top: 1px solid black;
      margin: 8px 0;
    }
    table {
      width: 100%;
      margin-top: 15px;
    }
    td {
      vertical-align: top;
    }
  </style>
</head>
<body>
  <div class="center">
    <div>Schedule of trust property held by the deceased</div>
    <div style="font-size:10px;">(Rules 374, 375 and 376)</div>
    <br>
    <div class="bold">Form No. 100</div>
    <br>
    <div class="bold">IN THE HIGH COURT OF JUDICATURE AT BOMBAY</div>
    <br>
  </div>

  <div>TESTAMENTARY AND INTESTATE JURISDICTION PETITION No. <span class="bold">${petitionNumber}</span> of 2020</div>
  <br>
  <div>
    Petition for probate of a will of <span class="bold">${deceasedName}</span> resident <span class="bold">${deceasedAddress}</span> having occupation of <span class="bold">${deceasedOccupation}</span>. Deceased
  </div>

  <br>
  <div class="right">
    <div class="bold">${petitionerName}</div>
    <div>Petitioner</div>
  </div>

  <br><br>
  <div class="center bold">SCHEDULE No. III</div>
  <div class="center">Schedule of Trust Property</div>
  <hr>
  <div style="display: flex; justify-content: flex-end;">
    <div>Rs.</div>&nbsp;&nbsp;<div>P</div>
  </div>
  <hr>
  <br>

  <div>Property held in trust for another and not beneficially or with general</div>
  <br>
  <table>
    <tr>
      <td>Power to confer a beneficial interest</td>
      <td class="right bold">Rs. ${parseFloat(property).toFixed(2)}</td>
    </tr>
    <tr>
      <td>Total</td>
      <td class="right bold">Rs. ${parseFloat(property).toFixed(2)}</td>
    </tr>
  </table>
  <hr>

  <br>
  <div>Petitioner: <span class="bold">${petitionerName}</span></div>
</body>
</html>`;

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const fileName = `${Date.now()}-form100.pdf`;
  const filePath = path.join(__dirname, "../pdfs", fileName);

  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "40px",
      bottom: "40px",
      left: "50px",
      right: "50px"
    }
  });

  await browser.close();
  return filePath;
};

const submitForm100 = async (req, res) => {
  try {
    const data = req.body;
    const filePath = await generateForm100PDF(data);

    await FormSubmission.create(data);

    await sendPdfToUser(
      req.user.fullName,
      req.user.email,
      filePath,
      "ProbateForm.pdf"
    );

    res.status(200).json({ msg: "Form submitted and PDF sent successfully." });
  } catch (error) {
    console.error("Error in submitForm:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { submitForm100 };
