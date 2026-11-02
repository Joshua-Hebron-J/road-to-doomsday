export interface Progress {
  journeyId: string;
  watchedIds: string[];
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
}
