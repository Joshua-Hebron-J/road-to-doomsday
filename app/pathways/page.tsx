import type { Metadata } from "next";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { ChooseYourPathClient } from "../components/choose-your-path-client";

export const metadata: Metadata = {
  title: "Choose Your Path | The Road to Doomsday",
  description:
    "Select your cinematic trajectory through the Multiverse Saga. Three distinct editorial dossiers tailored for essential narrative, incursion physics, and the complete multiversal chronicle.",
  openGraph: {
    title: "Choose Your Path | The Road to Doomsday",
    description:
      "Select your cinematic trajectory through the Multiverse Saga leading to Avengers: Doomsday.",
  },
};

export default function ChooseYourPathPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 pt-18">
        <ChooseYourPathClient />
      </main>
      <Footer />
    </div>
  );
}
