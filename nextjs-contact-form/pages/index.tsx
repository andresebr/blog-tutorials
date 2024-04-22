import ContactForm from "@/components/contact-form";
import styles from "@/styles/Home.module.css";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Contact form demo</title>
        <meta name="description" content="Next.js contact form demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <ContactForm />
      </main>
    </>
  );
}
