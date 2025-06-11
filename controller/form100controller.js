const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { sendPdfToUser } = require("../emailService/formMail");
const FormSubmission = require("../model/form100model");

const generatePDF = async (data) => {
  const {
    petitionNumber = "",
    deceasedName = "",
    deceasedAddress = "",
    deceasedOccupation = "",
    petitionerName = "",
  } = data;

  const propertyAmount = parseFloat(data.property || "0");
  const totalAmount = propertyAmount;

  // Safety validation
  if ([propertyAmount].some(isNaN)) {
    throw new Error("Invalid or missing numeric fields");
  }

  const doc = new PDFDocument({ size: "A4", margin: 70 });
  const fileName = `${Date.now()}-form.pdf`;
  const filePath = path.join(__dirname, `../pdfs/${fileName}`);
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  doc.font("Times-Roman").fontSize(10);
  doc.text("Schedule of trust property held by the deceased", {
    align: "center",
  });
  doc.moveDown(0.3);

  doc
    .fontSize(9)
    .fillColor("gray")
    .text("(Rules 374, 375 and 376)", { align: "center" });
  doc.moveDown(1);

  doc.fillColor("black").fontSize(11).text("Form No. 100", { align: "center" });
  doc.moveDown();
  doc.text("IN THE HIGH COURT OF JUDICATURE AT BOMBAY", { align: "center" });
  doc.moveDown();

  doc.text("TESTAMENTARY AND INTESTATE JURISDICTION PETITION No. ", {
    continued: true,
  });
  doc.font("Times-Bold").text(petitionNumber, { continued: true });
  doc.font("Times-Roman").text(" of 2020");
  doc.moveDown(1);

  doc.text("Petition for probate of last will of ", {
    continued: true,
  });
  doc.font("Times-Bold").text(deceasedName, { continued: true });
  doc.font("Times-Roman").text(", resident of ", { continued: true });
  doc.font("Times-Bold").text(deceasedAddress, { continued: true });
  doc.font("Times-Roman").text(", having occupation of ", { continued: true });
  doc.font("Times-Bold").text(deceasedOccupation, { continued: true });
  doc.font("Times-Roman").text(". Deceased");
  doc.moveDown();

  doc.font("Times-Bold").text(petitionerName, { align: "right" });
  doc.font("Times-Roman").text("Petitioner", { align: "right" });

  doc.moveDown();

  doc.font("Times-Roman").text("SCHEDULE No. III", { align: "center" });
  doc.text("Schedule of Trust Property", { align: "center" });
  doc.moveDown(0.5);

  doc.moveTo(70, doc.y).lineTo(525, doc.y).stroke();
  doc.moveDown(0.5);

  doc.text(" ", { continued: true });
  doc.text("Rs.  ", { continued: true, align: "right", width: 60 });
  doc.text("      P", { align: "right" });
  doc.moveDown(0.2);
  doc.moveTo(70, doc.y).lineTo(525, doc.y).stroke();
  doc.moveDown();

  doc
    .font("Times-Roman")
    .text(
      "Property held in trust for another and not beneficially or with general "
    );
  doc.moveDown(0.2);

  doc.text("Power to confer a beneficial intereste", { continued: true });
  doc
    .font("Times-Bold")
    .text(` Rs. ${propertyAmount.toFixed(2)}`, { align: "right" });

  doc.moveDown(1);
  doc.font("Times-Roman").text("Total", { continued: true });
  doc
    .font("Times-Bold")
    .text(` Rs. ${totalAmount.toFixed(2)}`, { align: "right" });

  doc.moveDown(1);
  doc.moveTo(70, doc.y).lineTo(525, doc.y).stroke();
  doc.moveDown(1);

  doc.font("Times-Roman").text("Petitioner: ", { continued: true });
  doc.font("Times-Bold").text(petitionerName);

  doc.end();

  await new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });

  return filePath;
};

const submitForm100 = async (req, res) => {
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

module.exports = { submitForm100 };
