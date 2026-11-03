/** View-only projections of existing journeys, events, chapters, or movies. */
export interface SpatialNode {
  id: string;
  label: string;
  caption: string;
  color: string;
  complete?: boolean;
  position?: [number, number, number];
}
/** Renderer-only edges: adapters can supply future relationship types without rebuilding the scene. */
export interface SpatialEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  color?: string;
}
export interface SpatialCanvasProps {
  nodes: SpatialNode[];
  selectedId: string;
  onSelect: (id: string) => void;
  variant: 'rift' | 'timeline' | 'chapters' | 'movies' | 'lineage';
  animated: boolean;
  active: boolean;
  onFailure: () => void;
  edges?: SpatialEdge[];
}
