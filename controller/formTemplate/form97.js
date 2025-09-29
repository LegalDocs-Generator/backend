const puppeteer = require("puppeteer");
const { generatePDFfromHTML } = require("../../utils/puppeteerService");

const getForm97HTML = async (data) => {
  const personsHtml = Array.isArray(data.person)
    ? data.person
        .map(
          (p, i) => `
      <tr>
      <tr>
  <td>${i + 1}</td>
  <td>${p?.[0]?.fullName || ""}</td>
  <td>${p?.[1]?.address || ""}</td>
  <td>${p?.[2]?.age || ""}</td>
  <td>${p?.[3]?.relationshipWithDeceased || ""}</td>
</tr>
`
        )
        .join("")
    : "";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: "Times New Roman"; font-size: 12px;  }
      div{
      line-height:2;
      
      }
      @page :right {
        margin-right: 3cm;  /* outer */
        margin-top: 2cm;
        margin-bottom: 2cm;
        margin-left: 5cm;   /* inner */
      }

      @page :left {
        margin-right: 5cm;  /* outer */
        margin-top: 2cm;
        margin-bottom: 2cm;
        margin-left: 3cm;   /* inner */
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
      .page1 { margin-top:50px; margin-bottom:50px; }
      .page2 { margin-top:65px; margin-bottom:50px; }
      .page3 { margin-top:30px; margin-bottom:50px; }
      .page4 { margin-top:30px; margin-bottom:50px; }
      .page5 { margin-top:30px; margin-bottom:50px; }
      .page6 { margin-top:70px; margin-bottom:50px; }


    </style>
  </head>
  <body>
<div class="page1">
  <div class="center">
    <div class="bold">IN THE HIGH COURT OF JUDICATURE AT BOMBAY</div>
    <div class="bold">TESTAMENTARY AND INTESTATE JURISDICTION</div>
    <div class="bold">PETITION NO. ${
      data.petitionNumber || "..................."
    } OF ${data.petitionYear || "...................."}</div>
  </div>

  <div class="section1" style="word-spacing: 10px;">
   Petition for Probate of the last Will and Testament of  <span class="bold">${
     data.deceasedFullName || ".................................."
   }</span>, 
   <div class="right"> ....Deceased.</div>
  </div>

  <br>

  <div class="section2" style="word-spacing: 10px;">
    <div>
      <span class="bold">${
        data.petitionerFullName || ".................................."
      }</span>  age of <span class="bold">${
    data.petitionerage || ".................................."
  }</span> <span class="right"></span>
    </div>

    <div>Domicile: <span class="bold">${
      data.petitionerDomicile || "....................."
    }</span> Nationality:  <span class="bold">${
    data.petitionerNationality || "....................."
  }</span> <span class="right"></span>
    </div>

    <div>Occupation: <span class="bold">${
      data.petitionerOccupation || "....................."
    }</span> Address:  <span class="bold">${
    data.petitionerFullAddress || "....................."
  }</span> <span class="right"></span>
    </div>

    <div>
    being the <span class="bold">${
     data.executors?.[0]?.fullName || 
 ".................................."
    }</span> named in the Will of the abovenamed Deceased.<span class="right"> </span>
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
  That  the  abovenamed <span class="bold">${
    data.deceasedFullName || ".................................."
  }</span> died at <span class="bold">${
    data.deceasedResidenceAtTimeOfDeath || ".................................."
  }</span> on or about the <span class="bold">${
    data.deceasedDeathDate || "........"
  }</span> day of 
  <span class="bold">${data.deceasedDeathMonth || "........"}</span>, 
  <span class="bold">${data.deceasedDeathYear || "........"}</span>.
  A true copy of Death Certificate of the Deceased is annexed hereto and marked as Exhibit "<span class="bold">${
    data.exhibitNumber1 || ".................................."
  }</span>" and a true copy of identity proof of the Deceased is annexed hereto and marked as Exhibit “<span class="bold">${
    data.exhibitNumber2 || ".................................."
  }</span>”. 
  </div>

  <br>
  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(2)</span>
  That the said deceased at the time of his death had a fixed place of abode at <span class="bold">${
    data.placeOfAbode || ".................................."
  }</span> and/or left property within Greater Bombay and in the State of Maharashtra and elsewhere in India.
  </div>
  <br>

  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(3)</span>
  That the said deceased left a writing, which is his last Will and testament. The said writing, hereinafter referred to as “the Will”, is marked as Exhibit "<span class="bold">${
    data.exhibitNumber3 || ".................................."
  }</span>" and is handed in separately for being filed and kept in a safe place in the 
  </div>
</div>


<div class="page-break page3">

  <div style="word-spacing: 10px;">
  Office of the Prothonotary and Senior Master. A copy of the said Will is hereto annexed and also marked as Exhibit “<span class="bold">${
    data.exhibitNumber4 || ".................................."
  }</span>”.</div>
  <br>
  <div style="word-spacing: 10px;">
  <span style="margin-right:15px;">(4)</span>
  That the said Will was executed at <span class="bold">${
    data.placeOfExecutionOfWill || ".................................."
  }</span>  
  on the <span class="bold">${data.executionDate || "........"}</span> day of 
  <span class="bold">${data.executionMonth || "........"}</span>, 
  <span class="bold">${data.executionYear || "........"}</span>.
  </div>
  <br>
  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(5)</span>
  That the Petitioner is the <span class="bold">${
    data.capacity || ".................................."
  }</span> named in the said Will or the Executor according to the tenor thereof.
  </div>
  <br>
  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(6)</span>
  The Petitioner has truly set forth in Schedule No.I, hereto annexed and marked as Exhibit “<span class="bold">${
    data.exhibitNumber5 || ".................................."
  }</span>”, all the property and credits which the Deceased died possessed of or entitled to at the time of his death, which have or are likely to come to his hands.
  </div>
</div>


<div class="page-break page4">

  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(7)</span>
  That the Petitioner has truly set forth in Schedule No. II, hereto annexed and marked Exhibit “<span class="bold">${
    data.exhibitNumber6 || ".................................."
  }</span>” all the items that by law, he is allowed to deduct for the purpose of ascertaining the net estate of the Deceased.
  </div>
  <br>
  <div style="word-spacing: 10px;"><span style="margin-right:20px;">(8)</span>
  That, the Petitioner has truly set forth in Schedule No. III, hereto annexed and marked Exhibit “<span class="bold">${
    data.exhibitNumber7 || ".................................."
  }</span>” the property held by the Deceased as a trustee for another and not beneficially or with general power to confer a beneficial interest.
  </div>
  <br>
  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(9)</span>
  That the assets of the Deceased after deducting the items mentioned in Schedule No. II but including all rents; interest and dividends which have accrued since the date of the death of the Deceased and increased value of the assets since the said date are of the value of Rs. <span class="bold">${
    data.schduleAmount || ".................................."
  }</span>.
  </div>
  <br>
  <div style="word-spacing: 10px;"><span style="margin-right:15px;">(10)</span>
  That the said Deceased left him surviving as his only heirs and next-of-kin according to <span class="bold">${
    data.lawApplicableToTheDeceased || ".................................."
  }</span>, the following persons, who are residing at the addresses set out
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
  That no application has been made to any District Court or District Delegate or to any High Court for Probate of any Will of the said Deceased or for Letters of Administration with or without the Will annexed to his property and credits.
  </div>
  <br>

  <div style="word-spacing: 10px;">The Petitioner, therefore, prays that Probate may be granted to him having effect throughout the State of Maharashtra.</div>
  <br>
  <div style="word-spacing: 10px;">Sworn / Solemnly affirmed at <span class"bold">${
    data.swornPlace || ".................................."
  }</span> )</div>
  <div>This <span class="bold">${
    data.swornDate || "............."
  }</span>  day of <span class="bold">${
    data.swornMonth || "..............."
  }, ${data.swornYear || "..............."}</span> )</div>

  <br><br>
  <div>Advocate for Petitioner</div>
  <div class="right">PETITIONER</div>
  </div>
</div>

<div class="page6 page-break ">
<div class="center underline bold">V E R I F I C A T I O N</div>
<br>
<div style="word-spacing: 10px;"><span style="margin-left:40px;">
I, <span class="bold">${
    data.petitionerFullName || ".................................."
  }</span>, 
</span>  the Petitioner abovenamed, do swear in the name of God / solemnly affirm  that what is stated in paragraphs <span class="bold">${
    data.statedPara || ".................................."
  }</span> is true to my own knowledge, and what is stated in the remaining paragraphs  <span class="bold">${
    data.remainingPara || ".................................."
  }</span> is stated on information and belief and I believe the same to be true.
 </div>
 <br>

 <div style="word-spacing: 10px;">Sworn / Solemnly affirmed at <span class"bold">${
   data.swornPlace || ".................................."
 }</span>   )</div>
<div>This <span class="bold">${
    data.swornDate || "............"
  }</span> day of <span class="bold">${data.swornMonth || "............."}, ${
    data.swornYear || "............"
  }</span>   )</div>
<div class="right">Before me,</div>
<br><br>
<div>Advocate for Petitioner</div>
</div>

  </body>
  </html>`;
};

async function generateForm97PDF(data) {
  const html = await getForm97HTML(data);
  return await generatePDFfromHTML(html);
}
module.exports = { generateForm97PDF, getForm97HTML };
