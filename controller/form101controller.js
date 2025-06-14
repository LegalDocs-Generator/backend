const puppeteer = require("puppeteer");
const FormSubmission = require("../model/form101model");
const { sendPdfToUser } = require("../emailService/formMail");

const generateForm101PDF = async (data) => {
  const {
    petitionNumber = "",
    deceasedName = "",
    deceasedName1 = "",
    deceasedName2 = "",
    deceasedName3 = "",
    deceasedName4 = "",
    deceasedAddress = "",
    deceasedOccupation = "",
    petitionerName = "",
    relationWithDeeceased = "",
    swearingLocation = "",
    swornDay = "",
    swornMonth = "",
    advocateFor = "",
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
      div{
     line-height: 1.4;
}
      
      
  </style>
</head>
<body>
  <div class="center">
    <div>Executor’s oath</div>
    <div style="font-size:12px;">(See rules 374)</div>
    <br>
    <div >Form No. 101</div>
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
  <span class="bold">${deceasedOccupation ||".................................."}</span> Deceased
</div>


 <div class="right">
    <span class="bold">${petitionerName || ".................................."}</span> Petitioner
  </div>

  <br>
  <div>
 I, <span class="bold">${deceasedName || ".................................."}, ${relationWithDeeceased || ".................................."}</span>, the Petitioner,  swear in the name of God that I believe and state that the Will referred to in the petition herein and marked Exhibit “B” is the last Will and testament of <span class="bold">${deceasedName1 || ".................................."}</span> alias <span class="bold">${deceasedName2 || ".................................."}</span> alias <span class="bold">${deceasedName3 || ".................................."}</span> alias <span class="bold">${deceasedName4 || ".................................."}</span> deceased, and that I am the executor therein named  and that I will faithfully administer the property and credits of the said deceased and in any way concerning his will by paying his debts and then the legacies therein bequeathed so far as the said assets will extend, and that I will make and exhibit a full and true inventory of the said property and credits in this Hon'ble Court within six months from the date of the grant to be made to me or within such further time as the  said Court may from time to time appoint and also render a true account of my administration to this Hon'ble Court within one year from the same date or within such further time as the said Court may from time to time appoint.
  </div>
  <br>
  <div>Sworn at <span class="bold">${swearingLocation ||".................................."}</span> }</div>
  <div>this <span class="bold">${swornDay || ".........."}</span> Day of <span class="bold">${swornMonth || ".........."}</span> 2020 }</div>
  <br>
  <div class="right">Before Me,</div>
  <br>
  <div class="right">Assistant Master / Associate,</div>
  <div class="right">High Court, Bombay</div>
  <div>Advocate for <span class="bold">${advocateFor || ".................................."}</span></div>
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

const submitForm101 = async (req, res) => {
  try {
    const data = req.body;
    const pdfBuffer = await generateForm101PDF(data);

    await FormSubmission.create(data);

    await sendPdfToUser(
      req.user.fullName,
      req.user.email,
      pdfBuffer,
      "Form_101.pdf"
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

module.exports = { submitForm101 };
