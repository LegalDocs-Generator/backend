const { generatePDFfromHTML } = require("../../utils/puppeteerService");


const getForm100HTML = async (data) => {
  const {
    petitionNumber = "",
    deceasedName = "",
    deceasedAddress = "",
    deceasedOccupation = "",
    petitionerName = "",
    property = 0,
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
  body {
    font-family: "Times New Roman";
    font-size: 12px;
    padding: 0;
    margin: 0; /* avoid conflict, let @page define margins */
  }

  .center { text-align: center; }
  .right { text-align: right; }
  .bold { font-weight: bold; }

  hr {
    border: none;
    border-top: 1px solid black;
    margin: 8px 0;
  }

  table {
    width: 100%;
    margin-top: 15px;
    border-collapse: collapse; /* consistency across forms */
  }

  td {
    vertical-align: top;
    padding: 3px;
  }

  div {
    line-height: 1.6; /* balanced between Form97 (2) and Form99 (1.4) */
  }

  /* Standardized margins for all forms */
  @page {
    size: A4;
    margin-top: 2cm;
    margin-bottom: 2cm;
  }

  @page :left {
    margin-left: 3cm;   /* inner */
    margin-right: 5cm;  /* outer */
  }

  @page :right {
    margin-left: 5cm;   /* inner */
    margin-right: 3cm;  /* outer */
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
};

async function generateForm100PDF(data) {
  const html = await getForm100HTML(data);
  return await generatePDFfromHTML(html);
}

module.exports = { generateForm100PDF, getForm100HTML };
