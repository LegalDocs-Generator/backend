const puppeteer = require("puppeteer");
const FormSubmission = require("../model/form100model");
const { sendPdfToUser } = require("../emailService/formMail");

const generateForm100PDF = async (data) => {
  const {
    petitionNumber = "",
    deceasedName = "",
    deceasedAddress = "",
    deceasedOccupation = "",
    petitionerName = "",
    property = 0,
  } = data;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
    font-family: Arial, sans-serif;
            margin: 1.5cm;
            padding: 0;
            font-size: 13px;  
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
      div{
line-height: 1.4;
}
     
     
  </style>
</head>
<body>
  <div class="center">
    <div>Schedule of trust property held by the deceased</div>
    <div style="font-size:12px;">(Rules 374, 375 and 376)</div>
    <br>
    <div>Form No. 100</div>
    <br>
    <div >IN THE HIGH COURT OF JUDICATURE AT BOMBAY</div>
    <br>
  </div>

  <div class="center">TESTAMENTARY AND INTESTATE JURISDICTION PETITION No. <span class="bold">${petitionNumber || ".................................."}</span> of 2020</div>
  <br>
   <div style="margin-left: 150px; ">
        Petition for probate of a will of <span class="bold">${deceasedName || ".................................."}</span>
        </div>
        <div style="margin-left: 120px; ">
      resident <span class="bold">${deceasedAddress || ".................................."}</span> having occupation of
  <span class="bold">${deceasedOccupation || ".................................."}</span> Deceased
</div>
  

  <div class="right">
    <span class="bold">${petitionerName || ".................................."}</span> Petitioner
  </div>

  <br><br>
  <div class="center ">SCHEDULE No. III</div>
  <div class="center">Schedule of Trust Property</div>
  <hr>
 <div style="display: flex; justify-content: flex-end; gap: 60px;">
        <div>Rs.</div>
        <div>P</div>
      </div>
  <hr>
  <br>

  <div>Property held in trust for another and not beneficially or with general</div>
  <br>
  <table>
    <tr>
      <td>Power to confer a beneficial interest</td>
      <td class="right bold">Rs. ${!isNaN(parseFloat(property)) ? parseFloat(property).toFixed(2) : "0"}</td>
    </tr>
    <tr>
      <td class="right">Total</td>
      <td class="right bold">Rs.  ${!isNaN(parseFloat(property)) ? parseFloat(property).toFixed(2) : "0"}</td>
    </tr>
  </table>
  <hr>

  <br>
  <div>Petitioner: <span class="bold">${petitionerName || ".................................."}</span></div>
</body>
</html>`;

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

   const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "40px",
      bottom: "40px",
      left: "50px",
      right: "50px",
    },
  });


  await browser.close();
  return pdfBuffer;
};

const submitForm100 = async (req, res) => {
  try {
    const data = req.body;
    const pdfBuffer = await generateForm100PDF(data);

    await FormSubmission.create(data);

    await sendPdfToUser(
      req.user.fullName,
      req.user.email,
      pdfBuffer,
      "Form_100.pdf"
    );

    res.status(200).json({
      success: true,
      message: "Form submitted and PDF sent successfully.",
    });
  } catch (error) {
    console.error("Error in submitForm:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { submitForm100 };
