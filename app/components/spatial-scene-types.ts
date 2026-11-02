/** View-only projections of existing journeys, events, chapters, or movies. */
export interface SpatialNode {
  id: string;
  label: string;
  caption: string;
  color: string;
  complete?: boolean;
}
export interface SpatialCanvasProps {
  nodes: SpatialNode[];
  selectedId: string;
  onSelect: (id: string) => void;
  variant: 'rift' | 'timeline' | 'chapters' | 'movies';
  animated: boolean;
  active: boolean;
  onFailure: () => void;
}
