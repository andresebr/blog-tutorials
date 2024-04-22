import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

function isEmpty(inputString?: string) {
  return !inputString || inputString.trim().length === 0;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, body } = req;

    if (method === "POST") {
      // Send email.
      await sendMail(body);
      res.status(200).send({ message: "Message successfully sent." });
    } else {
      // Error if method is not correct.
      res.status(405).end(`Method ${method} not allowed`);
    }
  } catch (err) {
    // Catch errors thrown in the process.
    res.status(400).json({
      error:
        err ||
        "There was an error sending the message. Please try again later.",
    });
  }
}

async function sendMail(data: {
  name: string;
  email: string;
  message: string;
}) {
  const { name, email, message } = data;

  await new Promise((resolve, reject) => {
    if (!isEmpty(name) && !isEmpty(message) && !isEmpty(email)) {
      if (email && EMAIL_REGEX.test(email)) {
        // Setup email.
        const mailOptions = {
          from: process.env.OUTBOX_EMAIL,
          to: process.env.INBOX_EMAIL,
          subject: `Message From ${name} - ${email}`,
          text: message + " | Reply to: " + email,
          html: `<div>${message}</div>`,
        };

        // Setup service.
        const transporter = nodemailer.createTransport({
          host: "smtp.zoho.com",
          secure: true,
          port: 465,
          authMethod: "LOGIN",
          auth: {
            user: process.env.OUTBOX_EMAIL,
            pass: process.env.OUTBOX_EMAIL_PASSWORD,
          },
        });

        // Send email.
        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log("Email sent", response);
            resolve(response);
          }
        });
      } else {
        reject("Please provide a valid email address.");
      }
    } else {
      reject("All fields are required.");
    }
  });
}
