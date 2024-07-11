const express = require("express") 
const cors = require("cors")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Updated middleware usage

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || 465,
  secure: process.env.EMAIL_PORT === "465", // Updated to compare as string
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
app.get("/", async (req, res) => {
  res.send("hello");
});

// Verify transporter configuration on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error("Transporter configuration error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.post("/send", async (req, res) => {
  const { name, senderEmail, message } = req.body;
  const recipientEmail = "michaiahbos@yahoo.com"; // Set your email address here

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`, // Sender's email is used in the 'from' field
    to: recipientEmail,
    subject: `Message from ${name}`,
    text: message,
    html: `<b>${message}</b><p>Sent by: ${senderEmail}</p>`, // Include sender's email in the body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    res.send({
      success: true,
      message: "Email successfully sent!",
    });
  } catch (error) {
    console.error("Error sending email: %s", error);
    res.status(500).send({
      success: false,
      message: "Failed to send email. Try again later.",
      error: error.message,
    });
  }
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
