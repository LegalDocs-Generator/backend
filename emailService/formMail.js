const { transporter } = require("../config/nodemailer/nodemailer");

const sendPdfToUser = async (name, toEmail, pdfBuffer, fileName = "FormDocument.pdf") => {
  try {
    const mailOptions = {
      from: `"LeagalDocs" <${process.env.ADMIN_EMAIL}>`,
      to: toEmail,
      subject: "Your Filled Form Document - LeagalDocs",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0056b3;">Hello ${name},</h2>
          <p>Thank you for submitting your form. Please find the attached PDF document with the details you provided.</p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p style="margin-top: 20px;">Regards,<br/>The LeagalDocs Team</p>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer, 
          contentType: "application/pdf",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("PDF email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending PDF email:", error);
    return false;
  }
};

module.exports = { sendPdfToUser };
