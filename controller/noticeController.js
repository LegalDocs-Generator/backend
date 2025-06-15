const puppeteer = require("puppeteer");
const NoticeSubmission = require("../model/noticeModel");
const { sendPdfToUser } = require("../emailService/formMail");

const generateNoticePDF = async (data) => {
 const personsHtml = Array.isArray(data.person)
  ? data.person
      .map(
        (p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${p.fullName || ""}</td>
        <td>${p.address || ""}</td>
        <td>${p.age || ""}</td>
        <td>${p.relationshipWithDeceased || ""}</td>
      </tr>`
      )
      .join("")
  : "";


  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: "Arial MT", sans-serif; font-size: 17px;  }
      div{
      line-height:2.2;
      
      }
      .center { text-align: center; }
      .right { text-align: right; }
      .bold { font-weight: bold; }
      .section1 { margin-left: 330px; margin-top:20px;}
      .section2 { margin-right: 200px; margin-top:10px; }
      table { width: 100%; border-collapse: collapse; }
      td, th { padding: 4px; vertical-align: top; }
      .page-break { page-break-before: always; }
      .underline {text-decoration: underline;}
      .italic { font-style: italic;letter-spacing: -0.8px; word-spacing: 8px; }

      .page1{ margin-top:50px; margin-bottom:50px; margin-left: 2cm; margin-right:1cm;}

      .page2{  margin-top:65px; margin-left:1cm;  margin-right:2.2cm; margin-bottom:50px; }

      .page3{ margin-top:30px; margin-bottom:50px; margin-left: 2.2cm; margin-right:0.9cm; }

      .page4{  margin-top:30px; margin-left:1cm;  margin-right:2.2cm; margin-bottom:50px; }

      .page5{ margin-top:30px; margin-bottom:50px; margin-left: 2.2cm; margin-right:0.9cm; }

      .page6{  margin-top:70px; margin-left:1cm;  margin-right:2.2cm; margin-bottom:50px; }

    </style>
  </head>
  <body>
<div class="page1">
  <div class="center">
    <div class="bold">IN THE HIGH COURT OF JUDICATURE AT BOMBAY</div>
    <div class="bold">TESTAMENTARY AND INTESTATE JURISDICTION</div>
    <div class="bold">PETITION NO. ${data.petitionNumber || "..................."} OF ${data.petitionYear || "...................."}</div>
  </div>

  <div class="section1" style="word-spacing: 10px;">
   Petition for Probate of the last Will and Testament (insert word “Photocopy or Certified copy”, if original is not available) of  <span class="bold">${data.deceasedFullName || ".................................."}</span>, 
   <div class="bold italic">
   [Insert name in full, nationality, domicile, religion (in case of Muslims, mention sect), marital status, occupation and, place of residence at the time of death. If the deceased was a bachelor or spinster, that should be stated]
   </div>
   <div class="right"> ....Deceased.</div>
  </div>

  <br>

  <div class="section2" style="word-spacing: 10px;">
    <div>
      <span class="bold">${data.petitionerFullName || ".................................."}</span>  age of <span class="bold">${data.petitionerage || ".................................."}</span> <span class="right">  )</span>
    </div>

    <div>Domicile: <span class="bold">${data.petitionerDomicile || "....................."}</span> Nationality:  <span class="bold">${data.petitionerNationality || "....................."}</span> <span class="right">)</span>
    </div>

    <div>Occupation: <span class="bold">${data.petitionerOccupation || "....................."}</span> Address:  <span class="bold">${data.petitionerFullAddress || "....................."}</span> <span class="right">)</span>
    </div>

    <div class="bold italic">
    (insert full name, age, nationality, domicile,Occupation and full address) <span class="right"> )</span>
    </div>

    <div>
    being the <span class="bold">${data.executor || ".................................."}</span><span class="right"> ) </span>
    </div>
    <div class="bold">(Sole Executor/One of the Executors/
    <span class="right"> )</span>
    </div>

    <div class="bold">Sole Surviving Executor(s)/All Executors) <span class="right"> )</span>
    </div>
    <div>named in the Will of the abovenamed Deceased. <span class="right"> )</span>	
    </div>
  </div>

  <div class="right">…PETITIONER(S)</div>
</div>

<div class="page-break page2">
  <div class="underline bold">THE PETITION OF THE PETITIONER ABOVENAMED
  </div>
  <br>
  <div class="bold">TO,</div>
  <div class="bold">THE HONOURABLE THE CHIEF JUSTICE AND JUDGES OF THE HIGH COURT
  </div>
  <div class="underline bold">SHEWETH:</div>
  <br>
  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(1)</span>
  That  the  abovenamed <span class="bold">${data.deceasedFullName || ".................................."}</span> <span class="bold italic"> (insert full name of the Deceased)</span> died at <span class="bold">${data.deceasedRescidenceAtTimeOfDeath || ".................................."}</span> <span class="bold italic"> (insert place of death of the Deceased) </span> on or about the<span class="bold">${data.deceasedDeathDate || ".............."}</span>
  day of <span class="bold">${data.deceasedDeathMonth || ".............."} , ${data.deceasedDeathYear || ".............."}</span> <span class="bold italic"> (insert date of death of the Deceased). </span>
  A true copy of Death Certificate of the Deceased is annexed hereto and marked as Exhibit "<span class="bold">${data.exhibitNumber1 || ".................................."}</span>" and a true copy of identity proof of the Deceased is annexed hereto and marked as Exhibit “<span class="bold">${data.exhibitNumber2 || ".................................."}</span>". <span class="bold italic">(If no identity proof is available, say so and mention reason and annexe a true copy of documentary proof in support thereof)</span> 
  </div>

  <br>
  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(2)</span>
  That the said deceased at the time of his death had a fixed place of abode at <span class="bold">${data.placeOfAbode || ".................................."}</span> and/or left property within Greater Bombay and in the State of Maharashtra and elsewhere in India. <span class="bold italic"> (details may be corrected as per the facts of the case)</span>
  </div>
  <br>

  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(3)</span>
  That the said deceased left a writing, which is his last Will and testament. The said writing, hereinafter referred to as “the Will”, is marked as Exhibit "<span class="bold">${data.exhibitNumber3 || ".................................."}</span>" and <span class="bold italic"> (insert word “Photocopy or Certified copy”, if original is not available) </span> is handed in separately for being filed and kept in a safe place in the 
  </div>
</div>


<div class="page-break page3">

  <div style="word-spacing: 10px;">
  Office of the Prothonotary and Senior Master. A copy of the said Will is hereto annexed and also marked as Exhibit “<span class="bold">${data.exhibitNumber4 || ".................................."}</span>".</div>
  <br>
  <div style="word-spacing: 10px;">
  <span style="margin-right:15px;">(4)</span>
  That the said Will <span class="bold italic">(if there is/are Codicil or Codicils, say so)</span>  was executed at <span class="bold italic">${data.placeOfExecutionOfWill || ".................................."}  (insert place of execution of Will and Codicil, if any)</span>  on the  <span class="bold">${data.ExecutionDate || "..............."}</span> day of <span class="bold italic">${data.ExecutionMonth || "................"} , ${data.ExecutionYear || "............."} (insert date of execution of Will and Codicil, if any) . (if Will and Codicil, if any,
  has been registered, mention details of registration) (and if Petition is filed on
  the basis of certified copy or photocopy of Will, state so and mention reason
  therefor and correct title and prayer clause accordingly)</span>
  </div>
  <br>
  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(5)</span>
  That the Petitioner is the <span class="bold italic">${data.capacity || ".................................."} (exact capacity i.e.Sole or one of the Executors)</span>  named in the said Will or the Executor according to the tenor thereof. <span class="bold italic"> (if Petitioner is one of the Executor, then state whether
  rights of other Executor(s) have been reserved or whether he/they has/have renounced his/their Executorship and whether document supporting renunciation is annexed).</span>
  </div>
  <br>
  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(6)</span>
  The Petitioner has truly set forth in Schedule No.I, hereto annexed and marked as Exhibit “<span class="bold">${data.exhibitNumber5 || ".................................."}</span>", all the property and credits which the Deceased died possessed of or entitled to at the time of his death, which have or are likely to come to his hands. <span class="bold italic"> (mention all properties as per the Will and Codicil. Petitioner to state whether any of the property is disposed of during the life time of the deceased and therefore, it is not mentioned in the schedule).</span>
  </div>
</div>


<div class="page-break page4">

  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(7)</span>
  That the Petitioner has truly set forth in Schedule No. II, hereto annexed and marked Exhibit “<span class="bold">${data.exhibitNumber6 || ".................................."}</span>" all the items that by law, he is allowed to deduct for the purpose of ascertaining the net estate of the Deceased. <span class="bold italic">(Delete this para if there are no such items).</span>
  </div>
  <br>
  <div style="word-spacing: 10px;"><span style="margin-right:20px;">(8)</span>
  That, the Petitioner has truly set forth in Schedule No. III, hereto annexed and marked Exhibit “<span class="bold">${data.exhibitNumber7 || ".................................."}</span>" the property held by the Deceased as a trustee for another and not beneficially or with general power to confer a beneficial interest. <span class="bold italic">(Delete this para if there is no such property)</span>
  </div>
  <br>
  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(9)</span>
  That the assets of the Deceased after deducting the items mentioned in Schedule No. II but including all rents; interest and dividends which have accrued since the date of the death of the Deceased and increased value of the assets since the said date are of the value of Rs. <span class="bold italic">${data.schduleAmount || ".................................."}
  (insert net total amount of Schedule of Petition).</span>
  </div>
  <br>
  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(10)</span>
  That the said Deceased left him surviving as his only heirs and next-of-kin according to <span class="bold italic">${data.lawApplicableToTheDeceased || ".................................."} (state what Law / name of the Act / name of the personal law applicable to the
  Deceased),</span> the following persons, who are residing at the addresses set out
  against their respective names :-
  </div>

  <br>
  <div>
  <table border="1">
    <tr>
      <th>Sr. No</th>
      <th>Name</th>
      <th>Address</th>
      <th>Age</th>
      <th>Relationship</th>
    </tr>
    ${personsHtml}
  </table>
</div>

</div>


<div class="page-break page5">
  <br>
  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(11)</span>
  That no application has been made to any District Court or District Delegate or to any High Court for Probate of any Will of the said Deceased or for Letters of Administration with or without the Will annexed to his property and credits.<span class="bold italic"> [or if made, state to what Court, by what person and what proceedings have been taken].</span>
  </div>
  <br>
  <div class="bold italic">(If petition is filed after three years from the death of the deceased, please explain delay(see Rule 382)).
  </div>
  <br>

  <div style="word-spacing: 10px;">The Petitioner, therefore, prays that Probate may be granted to him having effect throughout the State of Maharashtra <span class="bold italic">[or throughout India]. [insert words
  “throughout India”, if any property is situated outside the State of Maharashtra]. [insert words “limited until the original Will is produced”, if Petition is filed on the basis of photocopy or certified copy of Will and/or Codicil, if any] [insert words “reserving or renouncing the right(s) of Executor(s), if any Executor(s) has /
  have reserved or renounced his/her/their executorship]</span></div>
  <br>
  <div style="word-spacing: 10px;">Sworn / Solemnly affirmed at <span class"bold">${data.swornPlace || ".................................."}</span> )</div>
  <div>This <span class="bold">${data.swornDate || "............."}</span>  day of <span class="bold">${data.swornMonth || "..............."}, ${data.swornYear || "..............."}</span> )</div>

  <br><br>
  <div>Advocate for Petitioner</div>
  <div class="right">PETITIONER</div>
  </div>
</div>

<div class="page6 page-break ">
<div class="center underline bold">V E R I F I C A T I O N</div>
<br>
<div style="word-spacing: 10px;"><span style="margin-left:40px;">
I, <span class="bold">${data.petitionerFullName || ".................................."} (insert full name of the Petitioner)</span>, 
</span>  the Petitioner abovenamed, <span class="bold">do swear in the name of God / solemnly affirm</span>  that what is stated in paragraphs <span class="bold">${data.statedPara || ".................................."}</span> is true to my own knowledge, and what is stated in the remaining paragraphs  <span class="bold">${data.remainingPara || ".................................."}</span> is stated on information and belief and I believe the same to be true.
 </div>
 <br>

 <div style="word-spacing: 10px;">Sworn / Solemnly affirmed at <span class"bold">${data.swornPlace || ".................................."}</span>   )</div>
<div>This <span class="bold">${data.swornDate || "............"}</span> day of <span class="bold">${data.swornMonth || "............."}, ${data.swornYear || "............"}</span>   )</div>
<div class="right">Before me,</div>
<br><br>
<div>Advocate for Petitioner</div>
</div>

  </body>
  </html>`;

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    
   
  });

  await browser.close();
  return pdfBuffer;
};

module.exports = generateNoticePDF;

const submitNotice = async (req, res) => {
  try {
    const data = req.body;
    const pdfBuffer = await generateNoticePDF(data);

    await NoticeSubmission.create(data);

    await sendPdfToUser(
      req.user.fullName,
      req.user.email,
      pdfBuffer,
      "Notice.pdf"
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

module.exports = { submitNotice };
