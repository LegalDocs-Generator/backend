const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { sendPdfToUser } = require("../emailService/formMail");
const FormSubmission = require("../model/form99model");

const generatePDF = async (data) => {
  const {
    petitionNumber = "",
    deceasedName = "",
    deceasedAddress = "",
    deceasedOccupation = "",
    petitionerName = "",
  } = data;

  const debtAmount = parseFloat(data.debtAmount || "0");
  const funeralExpenses = parseFloat(data.funeralExpenses || "0");
  const mortgageEncumbrances = parseFloat(data.mortgageEncumbrances || "0");
  const totalAmount = parseFloat(data.totalAmount || "0");

  // Safety validation
  if (
    [debtAmount, funeralExpenses, mortgageEncumbrances, totalAmount].some(isNaN)
  ) {
    throw new Error("Invalid or missing numeric fields");
  }

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const fileName = `${Date.now()}-form.pdf`;
  const filePath = path.join(__dirname, `../pdfs/${fileName}`);
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  doc.font("Times-Roman").fontSize(10);
  doc.text("Schedule of debts of the deceased etc.", { align: "center" });
  doc.moveDown(0.3);

  doc
    .fontSize(9)
    .fillColor("gray")
    .text("(Rules 374, 375 and 376)", { align: "center" });
  doc.moveDown(1);

  doc.fillColor("black").fontSize(11).text("Form No. 99", { align: "center" });
  doc.moveDown();
  doc.text("IN THE HIGH COURT OF JUDICATURE AT BOMBAY", { align: "center" });
  doc.moveDown();

  doc.text("TESTAMENTARY AND INTESTATE JURISDICTION PETITION No. ", {
    continued: true,
  });
  doc.font("Times-Bold").text(petitionNumber, { continued: true });
  doc.font("Times-Roman").text(" of 2020");
  doc.moveDown(1);

  doc.text("Petition for probate of last will and testament of ", {
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

  doc.font("Times-Roman").text("SCHEDULE No. II", { align: "center" });
  doc.text("Schedule of Debts, etc.", { align: "center" });
  doc.moveDown(0.5);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  
  doc.text(" ", { continued: true });
  doc.text("Rs.  ", { continued: true, align: "right", width: 60 });
  doc.text("      P", { align: "right" });
  doc.moveDown(0.2);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  doc
    .font("Times-Roman")
    .text(
      "Amount of debts due and owing from the deceased, payable by law out of estate"
    );
  doc.moveDown(0.2);

  doc.text("Amount of Funeral expenses", { continued: true });
  doc
    .font("Times-Bold")
    .text(` Rs. ${funeralExpenses.toFixed(2)}`, { align: "right" });

  doc
    .font("Times-Roman")
    .text("Amount of mortgage encumbrances", { continued: true });
  doc
    .font("Times-Bold")
    .text(` Rs. ${mortgageEncumbrances.toFixed(2)}`, { align: "right" });

  doc.moveDown(1);
  doc.font("Times-Roman").text("Total", { continued: true });
  doc
    .font("Times-Bold")
    .text(` Rs. ${totalAmount.toFixed(2)}`, { align: "right" });

  doc.moveDown(1);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
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

const submitForm99 = async (req, res) => {
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

module.exports = { submitForm99 };
