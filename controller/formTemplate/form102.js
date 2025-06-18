const puppeteer = require("puppeteer");

const generateForm102PDF = async (data) => {
  const {
    petitionNumber = "",
    deceasedName = "",
    deceasedAddress = "",
    deceasedOccupation = "",
    petitionerName = "",
    witnessName = "",
    witnessAge = "",
    witnessAddress = "",
    dateOfDeath = "",
    swearingLocation = "",
    swornDay = "",
    swornMonth = "",
    swornYear = "",
    advocateFor = "",
  } = data;
  const formattedDate = new Date(data.dateOfDeath).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

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
      .left-margin{
      margin-left:30px;
      }
.numbered-line {
 margin-left:30px;
  display: flex;
  align-items: flex-start;
}

.number {
  width: 20px;
  flex-shrink: 0;
}

.text {
  flex: 1;
  text-align: justify;
}
div{
line-height: 1.4;
}
  </style>
</head>
<body>
  <div class="center">
    <div>Affidavit of the attesting witness</div>
    <div style="font-size:12px;">(See rules 374 and 375)</div>
    <br>
    <div >Form No. 102</div>
    <br>
    <div >IN THE HIGH COURT OF JUDICATURE AT BOMBAY</div>
    <br>
  </div>

  <div class="center">TESTAMENTARY AND INTESTATE JURISDICTION PETITION No. <span class="bold">${
    petitionNumber || ".................................."
  }</span> of 2020</div>
  <br>
   <div style="margin-left: 150px; ">
        Petition for probate of a will of <span class="bold">${
          deceasedName || ".................................."
        }</span>
        </div>
        <div style="margin-left: 120px; ">
      resident <span class="bold">${
        deceasedAddress || ".................................."
      }</span> having occupation of
  <span class="bold">${
    deceasedOccupation || ".................................."
  }</span> Deceased
</div>

  <div class="right">
    <span class="bold">${
      petitionerName || ".................................."
    }</span> Petitioner
  </div>

  <br>
  <div>
   I, <span class="bold">${
     witnessName || ".................................."
   }</span>, aged about <span class="bold">${
    witnessAge || "................"
  }</span> years, residing at <span class="bold">${
    witnessAddress || ".................................."
  }</span> swear in the name of God and say as follows:-
  </div>
  <br>
  <div class="numbered-line">
  <span class="number">1)</span>
  <span class="text"> That I knew and was well acquainted with the deceased <span class="bold">${
    deceasedName || ".................................."
  }</span>  above named</span>
  </div>

   <div class="numbered-line">
  <span class="number">2)</span>
  <span class="text"> That on the <span class="bold">${
    formattedDate || ".................................."
  }</span>, I was present together with <span class="bold">${
    petitionerName || ".................................."
  }</span> at the house of <span class="bold">${
    deceasedName || ".................................."
  }</span>  and we did then and there see the said deceased set and subscribe his name at foot of the testamentary paper in the English language and character, which is referred to in. the petition herein and marked Exhibit “B”, and declare and publish, the same as his last Will and testament.</span>
  </div>

  <div class="numbered-line">
  <span class="number">3)</span>
  <span class="text"> That thereupon I, this deponent and the said <span class="bold">${
    petitionerName || ".................................."
  }</span> did at the request of the said deceased and in his presence and in the presence of each other all being present at the same time set and subscribe our respective names and signatures at foot of the said testamentary paper as witnesses thereto.</span>
  </div>

  <div class="numbered-line">
  <span class="number">4)</span>
  <span class="text"> That the name and signature <span class="bold">${
    deceasedName || ".................................."
  }</span>  subscribed at the foot of the testamentary paper as of the party executing the same is in the proper hand-writing of the said deceased and the name and signature also subscribed and written at foot of the said testamentary paper as of the parties attesting execution of the same are in the proper respective handwritings of the said and of me this deponent respectively.</span>
  </div>
  
  <div class="numbered-line">
  <span class="number">5)</span>
  <span class="text">
    That at the time the said deceased so subscribed his name and signature to the said will as aforesaid,
    <span class="bold">${
      deceasedName || ".................................."
    }</span>, he was of sound and disposing mind, memory and understanding and to the best of my belief made and published the name of his free will and pleasure.
  </span>
</div>



  <br>
  <br>
  <div>Sworn at <span class="bold">${
    swearingLocation || ".................................."
  }</span> }</div>
  <div>this <span class="bold">${
    swornDay || ".........."
  }</span> Day of <span class="bold">${swornMonth || "..........."} ${
    swornYear || "............"
  }</span> }</div>
  <br>
  <div class="right">Before Me,</div>
  <br>
  <div class="right">Assistant Master / Associate,</div>
  <div class="right">High Court, Bombay</div>
  <div>Advocate for <span class="bold">${
    advocateFor || ".................................."
  }</span></div>
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

module.exports = { generateForm102PDF };
