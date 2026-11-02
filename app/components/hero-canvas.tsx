'use client';

import { useState } from 'react';
import { getAllJourneys, calculateJourneyStats } from '../lib/journey';
import { SceneExplorer } from './scene-explorer';
import { Button } from './ui/button';

const pathways = getAllJourneys();
const colors = ['#34d399', '#cbd5e1', '#facc15'];
export function HeroCanvas() {
  const [selectedId, setSelectedId] = useState(pathways[0].id);
  const selected =
    pathways.find((journey) => journey.id === selectedId) ?? pathways[0];
  const nodes = pathways.map((journey, index) => ({
    id: journey.id,
    label: journey.title,
    color: colors[index],
    caption: `${calculateJourneyStats(journey.id).formattedRuntime} · ${journey.movieIds.length} entries`,
  }));
  return (
    <div className="w-full min-w-0">
      <SceneExplorer
        title="Choose your reality"
        variant="rift"
        nodes={nodes}
        selectedId={selectedId}
        onSelect={setSelectedId}
      >
        <p className="text-sm text-slate-300 leading-relaxed">
          {selected.idealFor}
        </p>
        <Button href={`/pathways/${selectedId}`} variant="primary" size="md">
          Enter this pathway →
        </Button>
      </SceneExplorer>
    </div>
  );
}
