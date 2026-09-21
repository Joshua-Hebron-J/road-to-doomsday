export interface Movie {
  id: string;
  title: string;
  year: number;
  runtime: number;
  type: "movie" | "series" | "special";
  importance: "essential" | "optional";
  description: string;
  whyItMatters: string;
  prerequisites: string[];
  postCreditRequired: boolean;
}
