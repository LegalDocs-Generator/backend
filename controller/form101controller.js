const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { sendPdfToUser } = require("../emailService/formMail");
const FormSubmission = require("../model/form101model");

const generatePDF = async (data) => {
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

  const doc = new PDFDocument({ size: "A4", margin: 70 });
  const fileName = `${Date.now()}-form.pdf`;
  const filePath = path.join(__dirname, `../pdfs/${fileName}`);
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  doc.font("Times-Roman").fontSize(10);
  doc.text("Executor’s oath", { align: "center" });
  doc.moveDown(0.3);

  doc.fontSize(9).fillColor("gray").text("(See rules 374)", { align: "center" });
  doc.moveDown(1);

  doc.fillColor("black").fontSize(11).text("Form No. 101", { align: "center" });
  doc.moveDown();
  doc.text("IN THE HIGH COURT OF JUDICATURE AT BOMBAY", { align: "center" });
  doc.moveDown();

  doc.text("TESTAMENTARY AND INTESTATE JURISDICTION PETITION No. ", {
    continued: true,
  },{ align: "center" });
  doc.font("Times-Bold").text(petitionNumber, { continued: true });
  doc.font("Times-Roman").text(" of 2020");
  doc.moveDown(1);

  doc.text("Petition for probate of a will of ", { continued: true });
  doc.font("Times-Bold").text(deceasedName, { continued: true });
  doc.font("Times-Roman").text(", resident ", { continued: true });
  doc.font("Times-Bold").text(deceasedAddress, { continued: true });
  doc.font("Times-Roman").text(", having occupation of ", { continued: true });
  doc.font("Times-Bold").text(deceasedOccupation, { continued: true });
  doc.font("Times-Roman").text(". Deceased", { continued: true });
  doc.moveDown(0.5);

  doc.font("Times-Bold").text(`${petitionerName}`, { align: "right" });
  doc.font("Times-Roman").text("Petitioner", { align: "right" });

  doc.moveDown(1.2);

  doc.font("Times-Roman").text("I, ", { continued: true });
doc.font("Times-Bold").text(petitionerName, { continued: true });
doc.font("Times-Roman").text(", ", { continued: true });
doc.font("Times-Bold").text(relationWithDeeceased, { continued: true });
doc.font("Times-Roman").text(", the Petitioner, swear in the name of God that I believe and state that the Will referred to in the petition herein and marked Exhibit “B” is the last Will and testament of ", { continued: true });
doc.font("Times-Bold").text(deceasedName1, { continued: true });
doc.font("Times-Roman").text(" alias ", { continued: true });
doc.font("Times-Bold").text(deceasedName2, { continued: true });
doc.font("Times-Roman").text(" alias ", { continued: true });
doc.font("Times-Bold").text(deceasedName3, { continued: true });
doc.font("Times-Roman").text(" alias ", { continued: true });
doc.font("Times-Bold").text(deceasedName4, { continued: true });
doc.font("Times-Roman").text(", deceased, and that I am the executor therein named and that I will faithfully administer the property and credits of the said deceased and in any way concerning his will by paying his debts and then the legacies therein bequeathed so far as the said assets will extend, and that I will make and exhibit a full and true inventory of the said property and credits in this Hon'ble Court within six months from the date of the grant to be made to me or within such further time as the said Court may from time to time appoint and also render a true account of my administration to this Hon'ble Court within one year from the same date or within such further time as the said Court may from time to time appoint.");


  doc.moveDown(1);
  doc.text(`Sworn at ${swearingLocation}`, { continued: true });
  doc.text(" }");
  doc.moveDown(0.5);

  doc.text(`this ${swornDay} Day of ${swornMonth} 2020`, { continued: true });
  doc.text(" }");
  doc.moveDown(2);

  doc.text("Before Me,", { align: "right" });
  doc.moveDown();
  doc.text("Assistant Master / Associate,", { align: "right" });
  doc.text("High Court, Bombay", { align: "right" });
  doc.moveDown(2);

  doc.text(`Advocate for ${advocateFor}`);

  doc.end();

  await new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });

  return filePath;
};

const submitForm101 = async (req, res) => {
  try {
    const data = req.body;
    const filePath = await generatePDF(data);

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

module.exports = { submitForm101 };
