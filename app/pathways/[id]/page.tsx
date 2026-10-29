import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { JourneyEngineView } from "../../components/journey-engine-view";
import {
  getAllJourneys,
  getJourneyById,
  getJourneyChapters,
} from "../../lib/journey";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const journeys = getAllJourneys();
  return journeys.map((journey) => ({
    id: journey.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const journey = getJourneyById(id);

  if (!journey) {
    return {
      title: "Pathway Not Found | The Road to Doomsday",
      description: "Timeline anomaly detected. Specified journey does not exist.",
    };
  }

  return {
    title: `${journey.title} | The Road to Doomsday`,
    description: journey.description,
    openGraph: {
      title: `${journey.title} — The Road to Doomsday`,
      description: journey.description,
    },
  };
}

export default async function PathwayDetailPage({ params }: PageProps) {
  const { id } = await params;
  const journey = getJourneyById(id);

  if (!journey) {
    notFound();
  }

  const chapters = getJourneyChapters(journey.id);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <JourneyEngineView journey={journey} chapters={chapters} />
      </main>
      <Footer />
    </div>
  );
}
