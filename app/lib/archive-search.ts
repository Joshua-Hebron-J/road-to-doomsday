import { movies } from "../data/movies";
import { chapters } from "../data/chapters";
import { journeys } from "../data/journeys";
import { CHARACTERS } from "../data/variants";

export type SearchKind = "title" | "character" | "phase" | "theme";
export interface SearchEntry {
  id: string;
  kind: SearchKind;
  title: string;
  tags: string[];
  phase?: number;
  movieId?: string;
  href?: string;
}

export const searchThemes = chapters.map((chapter) => ({
  id: chapter.id,
  title: chapter.title.replace(/^Chapter [IVX]+: /, ""),
}));

export const searchIndex: SearchEntry[] = [
  ...movies.map((movie): SearchEntry => ({
    id: movie.id,
    kind: "title",
    title: movie.title,
    movieId: movie.id,
    phase: movie.phase,
    tags: [
      movie.type,
      movie.importance,
      String(movie.year),
      ...(movie.phase ? ["Phase " + movie.phase] : []),
      ...searchThemes.filter((theme) =>
        chapters.find((chapter) => chapter.id === theme.id)?.movieIds.includes(movie.id),
      ).map((theme) => theme.title),
    ],
  })),
  ...CHARACTERS.map((character): SearchEntry => ({
    id: character.id,
    kind: "character",
    title: character.name,
    tags: ["Character archive"],
    href: "/#character-" + character.id,
  })),
  ...Array.from(new Set(movies.flatMap((movie) => movie.phase ? [movie.phase] : [])))
    .sort((a, b) => a - b)
    .map((phase): SearchEntry => ({
      id: "phase-" + phase,
      kind: "phase",
      title: "Phase " + phase,
      phase,
      tags: ["MCU release phase"],
    })),
  ...searchThemes.flatMap((theme): SearchEntry[] => {
    const journey = journeys.find((entry) => entry.chapters.includes(theme.id));
    return journey ? [{
      id: theme.id,
      kind: "theme",
      title: theme.title,
      tags: ["Editorial chapter theme", journey.title],
      href: "/pathways/" + journey.id + "#" + theme.id + "-trigger",
    }] : [];
  }),
];

export function searchArchive(query: string, kind = "", phase = "", theme = "") {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const chapter = chapters.find((entry) => entry.id === theme);
  return searchIndex.filter((entry) => {
    if (kind && entry.kind !== kind) return false;
    if (phase && String(entry.phase) !== phase) return false;
    if (theme && (!chapter || !entry.movieId || !chapter.movieIds.includes(entry.movieId))) return false;
    const text = [entry.title, ...entry.tags].join(" ").toLocaleLowerCase();
    return words.every((word) => text.includes(word));
  }).sort((a, b) => {
    const exact = query.trim().toLocaleLowerCase();
    return Number(b.title.toLocaleLowerCase() === exact) -
      Number(a.title.toLocaleLowerCase() === exact);
  });
}
