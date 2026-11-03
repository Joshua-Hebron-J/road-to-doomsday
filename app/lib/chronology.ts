import { events } from '../data/events';
import {
  getJourneyById,
  getJourneyChapters,
  getMovieById,
  getAllJourneys,
} from './journey';
import type { Event } from '../types/event';
import type { Movie } from '../types/movie';
import type {
  SpatialNode,
  SpatialEdge,
} from '../components/spatial-scene-types';
export type TimelineMode = 'story' | 'release';
export interface TimelinePreferences {
  version: 1;
  mode: TimelineMode;
  journeyId: string;
  chapterId: string;
  selectedId: string;
}
export const DEFAULT_TIMELINE: TimelinePreferences = {
  version: 1,
  mode: 'story',
  journeyId: getAllJourneys()[0].id,
  chapterId: 'all',
  selectedId: events[0].id,
};
export interface ChronologyEntry {
  event: Event;
  movie: Movie;
  domain: string;
  dateLabel: string;
  sort: number;
}
export function getChronology(
  mode: TimelineMode,
  journeyId: string,
  chapterId = 'all',
): ChronologyEntry[] {
  const journey = getJourneyById(journeyId);
  if (!journey) return [];
  const chapter = getJourneyChapters(journeyId).find(
    (item) => item.id === chapterId,
  );
  if (chapterId !== 'all' && !chapter) return [];
  return events
    .flatMap((event) => {
      const movie = event.relatedMovieId
        ? getMovieById(event.relatedMovieId)
        : undefined;
      if (
        !movie ||
        !journey.movieIds.includes(movie.id) ||
        (chapter && !chapter.movieIds.includes(movie.id))
      )
        return [];
      if (mode === 'release')
        return [
          {
            event,
            movie,
            domain: movie.release ? 'Release dates' : 'Release year only',
            dateLabel: movie.release
              ? `${movie.release.date} · US ${movie.release.kind === 'theatrical' ? 'theatrical' : 'streaming premiere'}`
              : `${movie.year} · exact release unverified`,
            sort: movie.release
              ? Date.parse(movie.release.date)
              : Date.UTC(movie.year, 0, 1),
          },
        ];
      const chronology = event.chronology;
      const dated =
        chronology?.placement === 'dated' && Number.isFinite(chronology.year);
      const domain = dated
        ? 'Dated story events'
        : chronology?.placement === 'outside-time'
          ? 'Outside time'
          : 'Undated archive';
      return [
        {
          event,
          movie,
          domain,
          dateLabel: event.date,
          sort: dated
            ? chronology!.year!
            : domain === 'Outside time'
              ? 10000
              : 20000,
        },
      ];
    })
    .sort(
      (a, b) =>
        a.sort - b.sort || events.indexOf(a.event) - events.indexOf(b.event),
    );
}
export function clampTimelineIndex(value: number, length: number) {
  return Math.max(
    0,
    Math.min(
      Math.max(0, length - 1),
      Number.isFinite(value) ? Math.round(value) : 0,
    ),
  );
}
export function normalizeTimelinePreferences(
  value: unknown,
): TimelinePreferences {
  if (!value || typeof value !== 'object') return DEFAULT_TIMELINE;
  const data = value as Partial<TimelinePreferences>;
  if (data.version !== 1) return DEFAULT_TIMELINE;
  const journeyId =
    getJourneyById(data.journeyId ?? '')?.id ?? DEFAULT_TIMELINE.journeyId;
  const chapterId = getJourneyChapters(journeyId).some(
    (c) => c.id === data.chapterId,
  )
    ? data.chapterId!
    : 'all';
  return {
    version: 1,
    mode: data.mode === 'release' ? 'release' : 'story',
    journeyId,
    chapterId,
    selectedId: events.some((e) => e.id === data.selectedId)
      ? data.selectedId!
      : DEFAULT_TIMELINE.selectedId,
  };
}
/** Separate yearless lanes: no fabricated date or chronological bridge across domains. */
export function getChronologyScene(
  entries: ChronologyEntry[],
  mode: TimelineMode,
  reveal: boolean,
  watched: (id: string) => boolean,
) {
  const nodes: SpatialNode[] = entries.map((entry, index) => {
    const lane = entries.filter((e) => e.domain === entry.domain);
    const laneIndex = lane.indexOf(entry);
    const span = lane.at(-1)!.sort - lane[0].sort;
    const x =
      mode === 'release' && span > 0
        ? ((entry.sort - lane[0].sort) / span - 0.5) * 8
        : (laneIndex - (lane.length - 1) / 2) * 2.4;
    return {
      id: entry.event.id,
      label:
        reveal || watched(entry.movie.id)
          ? entry.event.title
          : entry.movie.title,
      caption:
        mode === 'release' || reveal || watched(entry.movie.id)
          ? entry.dateLabel
          : entry.domain,
      color:
        entry.domain === 'Outside time'
          ? '#c4b5fd'
          : entry.domain === 'Undated archive'
            ? '#facc15'
            : '#34d399',
      complete: watched(entry.movie.id),
      position: [
        x,
        mode === 'release'
          ? 0
          : entry.domain === 'Dated story events'
            ? 1.4
            : entry.domain === 'Outside time'
              ? 0
              : -1.4,
        (index % 2) * 0.15,
      ],
    };
  });
  const edges: SpatialEdge[] = entries.flatMap((entry, index) => {
    const previous = entries[index - 1];
    if (
      !previous ||
      entry.domain !== previous.domain ||
      (mode === 'story' && entry.domain !== 'Dated story events')
    )
      return [];
    return [
      {
        id: previous.event.id + '->' + entry.event.id,
        source: previous.event.id,
        target: entry.event.id,
        label: 'Chronological sequence',
        color: '#34d399',
      },
    ];
  });
  return { nodes, edges };
}
