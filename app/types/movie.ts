export type MediaType = "movie" | "series" | "special";
export type ImportanceLevel = "essential" | "optional";

export interface Movie {
  id: string;
  title: string;
  year: number;
  runtime: number; // Duration in minutes (for series: total runtime across episodes)
  type: MediaType;
  importance: ImportanceLevel;
  description: string;
  whyItMatters: string;
  prerequisites: string[];
  postCreditRequired: boolean;
  phase?: number;
  episodes?: number;
  isUpcoming?: boolean;
}

