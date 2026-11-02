export interface Journey {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  focus?: string;
  idealFor?: string;
  accent?: string;
  status?: string;
  highlights?: string[];
  chapters: string[];
  movieIds: string[];
}
