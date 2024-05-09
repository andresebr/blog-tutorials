import handleSendEmail from "@/service/contact";
import { FormEvent, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import contactFormStyles from "./contact-form.module.css";

export default function ContactForm() {
  const [responseMessage, setResponseMessage] = useState<string>();

  const { executeRecaptcha } = useGoogleReCaptcha();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const eventData = new FormData(event.currentTarget);

    // Clear response.
    setResponseMessage(undefined);

    // Check if executeRecaptcha is available.
    if (!executeRecaptcha) {
      setResponseMessage(
        "Execute reCAPTCHA not available yet likely meaning reCAPTCHA key not set."
      );
    } else {
      // If available. Try getting captcha token.
      executeRecaptcha("enquiryFormSubmit").then(async (captchaToken) => {
        const data = {
          name: eventData.get("name")?.toString(),
          email: eventData.get("email")?.toString(),
          message: eventData.get("message")?.toString(),
        };

        const { name, email, message } = data;

        if (name && email && message) {
          // Send generated captchaToken so it can processed in the server.
          const response = await handleSendEmail({
            name,
            email,
            message,
            captchaToken,
          });
          if (response.error) {
            setResponseMessage(response.error);
          } else {
            setResponseMessage(response.message);
          }
        } else {
          setResponseMessage("All fields are required.");
        }
      });
    }
  }

  return (
    <>
      <div className={contactFormStyles.container}>
        <h1 className={contactFormStyles.header}>Contact Me!</h1>
        <form onSubmit={onSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            title="Name"
            name="name"
            id="name"
            required
            className={contactFormStyles.formField}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            title="Email"
            name="email"
            id="email"
            required
            className={contactFormStyles.formField}
          />

          <label htmlFor="message">Message</label>
          <textarea
            rows={10}
            title="Message"
            name="message"
            id="message"
            required
            className={contactFormStyles.formField}
          ></textarea>

          <input
            type="submit"
            title="Send"
            value="Send"
            className={contactFormStyles.submitButton}
          />
        </form>
        {responseMessage && (
          <p className={contactFormStyles.alert}>{responseMessage}</p>
        )}
      </div>
    </>
  );
}
