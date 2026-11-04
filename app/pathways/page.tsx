import type { Metadata } from "next";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { ChooseYourPathClient } from "../components/choose-your-path-client";

import { ProgressProfile } from "../components/progress-profile";

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
      <main id="main-content" tabIndex={-1} className="flex-1 pt-18">
        <div className="mx-auto flex max-w-6xl justify-end px-4 pt-4">
          <a href="#progress-profile" className="inline-flex min-h-11 items-center rounded-lg border border-emerald-300/35 px-4 text-sm font-semibold text-emerald-100 focus-ring-doom">
            Journey profile and backups ↓
          </a>
        </div>
        <ChooseYourPathClient />
        <ProgressProfile />
      </main>
      <Footer />
    </div>
  );
}
