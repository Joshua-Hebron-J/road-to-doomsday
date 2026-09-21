export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  relatedMovieId?: string;
  special: boolean;
}
