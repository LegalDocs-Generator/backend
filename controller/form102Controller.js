const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { sendPdfToUser } = require("../emailService/formMail");
const FormSubmission = require("../model/form102model");

const generatePDF = async (data) => {
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
    executorOfWill = "",
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
  doc.text("Affidavit of the attesting witness", { align: "center" });
  doc.moveDown(0.3);

  doc.fontSize(9).fillColor("gray").text("(See rules 374 and 375)", { align: "center" });
  doc.moveDown(1);

  doc.fillColor("black").fontSize(11).text("Form No. 102", { align: "center" });
  doc.moveDown();
  doc.text("IN THE HIGH COURT OF JUDICATURE AT BOMBAY", { align: "center" });
  doc.moveDown();

  doc.text("TESTAMENTARY AND INTESTATE JURISDICTION PETITION No. ", { continued: true });
  doc.font("Times-Bold").text(petitionNumber, { continued: true });
  doc.font("Times-Roman").text(" of 2020");
  doc.moveDown();

  doc.text("Petition for probate of a will of ", { continued: true });
  doc.font("Times-Bold").text(deceasedName, { continued: true });
  doc.font("Times-Roman").text(", resident ", { continued: true });
  doc.font("Times-Bold").text(deceasedAddress, { continued: true });
  doc.font("Times-Roman").text(", having occupation of ", { continued: true });
  doc.font("Times-Bold").text(deceasedOccupation, { continued: true });
  doc.font("Times-Roman").text(". Deceased");
  doc.moveDown(0.5);

  doc.font("Times-Bold").text(`${petitionerName}`, { align: "right" });
  doc.font("Times-Roman").text("Petitioner", { align: "right" });

  doc.moveDown(2);

  // Affidavit body
  doc.text("I, ", { continued: true });
  doc.font("Times-Bold").text(witnessName, { continued: true });
  doc.font("Times-Roman").text(", aged about ", { continued: true });
  doc.font("Times-Bold").text(witnessAge, { continued: true });
  doc.font("Times-Roman").text(" years, residing at ", { continued: true });
  doc.font("Times-Bold").text(witnessAddress, { continued: true });
  doc.font("Times-Roman").text(", swear in the name of God and say as follows:-");
  doc.moveDown();

  const points = [
    `That I knew and was well acquainted with the deceased `,
    `That on the `,
    `That thereupon I, this deponent and the said `,
    `That the name and signature `,
    `That at the time the said deceased so subscribed his name to the said will as aforesaid, `
  ];

  const subPoints = [
    { pre: points[0], bold: deceasedName, post: " above named." },
    { pre: points[1], bold: dateOfDeath, post: ", I was present together with ", bold2: executorOfWill, post2: ` at the house of `, bold3: deceasedName, post3: ` and we did then and there see the said deceased set and subscribe his name at foot of the testamentary paper in the English language and character, which is referred to in the petition herein and marked Exhibit “B”, and declare and publish, the same as his last Will and testament.` },
    { pre: points[2], bold: executorOfWill, post: ` did at the request of the said deceased and in his presence and in the presence of each other all being present at the same time set and subscribe our respective names and signatures at foot of the said testamentary paper as witnesses thereto.` },
    { pre: points[3], bold: deceasedName, post: ` subscribed at the foot of the testamentary paper as of the party executing the same is in the proper hand-writing of the said deceased and the name and signature also subscribed and written at foot of the said testamentary paper as of the parties attesting execution of the same are in the proper respective handwritings of the said `, bold2: executorOfWill, post2: ` and of me this deponent respectively.` },
    { pre: points[4], bold: deceasedName, post: `, he was of sound and disposing mind, memory and understanding and to the best of my belief made and published the name of his free will and pleasure.` }
  ];

  subPoints.forEach((point, i) => {
    doc.text(`${i + 1}) `, { continued: true });
    doc.font("Times-Roman").text(point.pre, { continued: true });
    doc.font("Times-Bold").text(point.bold, { continued: true });
    doc.font("Times-Roman").text(point.post || "", { continued: true });

    if (point.bold2) {
      doc.font("Times-Bold").text(point.bold2, { continued: true });
      doc.font("Times-Roman").text(point.post2 || "", { continued: true });
    }
    if (point.bold3) {
      doc.font("Times-Bold").text(point.bold3, { continued: true });
      doc.font("Times-Roman").text(point.post3 || "", { continued: true });
    }

    doc.moveDown();
  });

  // Sworn at and date section
  doc.text("Sworn at ", { continued: true });
  doc.font("Times-Bold").text(swearingLocation, { continued: true });
  doc.font("Times-Roman").text(" }");
  doc.moveDown(0.5);

  doc.text("this ", { continued: true });
  doc.font("Times-Bold").text(swornDay, { continued: true });
  doc.font("Times-Roman").text(" Day of ", { continued: true });
  doc.font("Times-Bold").text(swornMonth, { continued: true });
  doc.font("Times-Roman").text(" 2020 }");
  doc.moveDown(2);

  doc.text("Before Me,", { align: "right" });
  doc.moveDown();
  doc.text("Assistant Master / Associate,", { align: "right" });
  doc.text("High Court, Bombay", { align: "right" });
  doc.moveDown(2);

  doc.text("Advocate for ", { continued: true });
  doc.font("Times-Bold").text(advocateFor);

  doc.end();

  await new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });

  return filePath;
};


const submitForm102 = async (req, res) => {
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

module.exports = { submitForm102 };
