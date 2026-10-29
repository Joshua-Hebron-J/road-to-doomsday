export interface Chapter {
  id: string;
  title: string;
  description: string;
  movieIds: string[];
  order?: number;
  subtitle?: string;
}
