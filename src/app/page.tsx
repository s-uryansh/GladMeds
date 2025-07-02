import { Metadata } from "next";
import Banner from "./components/home/hero";
import Work from "./components/home/work";
import Features from "./components/home/features";
import Simple from "./components/home/simple";
import Trade from "./components/home/trade";
import Faq from "./components/home/faq";
import ContactForm from "./components/ContactForm";

export const metadata: Metadata = {
  title: "GladMeds",
};

export default function Home() {
  return (
    <main>
      <Banner/>
      <Work />
      <Features />
      <Simple />
      <Trade />
      <Faq />
      <ContactForm />
    </main>
  );
}
