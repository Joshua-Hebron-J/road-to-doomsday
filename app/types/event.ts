export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  relatedMovieId?: string;
  special: boolean;
  chronology?: {
    placement: 'dated' | 'outside-time' | 'undated';
    year?: number;
  };
}
