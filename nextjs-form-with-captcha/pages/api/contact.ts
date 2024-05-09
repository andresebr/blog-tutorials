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
    // Get captchaToken from body.
    const { captchaToken } = body;

    if (method === "POST") {
      // Call method for validating the captcha.
      const captchaValidationResponse = await validateCaptcha(captchaToken);
      console.log(
        body.captchaToken.slice(0, 10) + "...",
        captchaValidationResponse
      );
      // Validate that capctha token has been validated.
      // Score check can be tweaked depending on how strict you want this check to be.
      if (
        captchaValidationResponse &&
        captchaValidationResponse.success &&
        captchaValidationResponse.score > 0.5
      ) {
        // Send email if validations pass.
        await sendMail(body);
        res.status(200).send({ message: "Message successfully sent" });
      } else {
        res.status(405).json({ message: "Bots are not allowed" });
      }
    } else {
      // Error if method is not correct.
      res.status(405).end(`Method ${method} not allowed`);
    }
  } catch (err) {
    // Catch errors thrown in the process.
    res.status(400).json({
      error:
        err || "There was an error sending the message. Please try again later",
    });
  }
}

async function validateCaptcha(captchaToken: string) {
  // Verify that both captchaToken and RECAPTCHA_SECRET_KEY were set.
  if (captchaToken && process.env.RECAPTCHA_SECRET_KEY) {
    console.log("Validating captcha...");
    // Validate captcha.
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?${new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: captchaToken,
      })}`,
      {
        method: "POST",
      }
    );

    return response.json();
  } else {
    // Show in the console if needed values are not set.
    console.log(
      "captchaToken or RECAPTCHA_SECRET_KEY not set. Captcha could not be validated"
    );
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
        reject("Please provide a valid email address");
      }
    } else {
      reject("All fields are required");
    }
  });
}
