// Layout types for hierarchy visualization

export interface LayoutConfig {
  nodeWidth: number;
  minNodeSpacing: number;
  levelHeight: number;
  margin: number;
  labelMargin: number;
}

export interface BranchBounds {
  startX: number;
  width: number;
  nodeCount: number;
  maxNodesInLevel: number;
}

export interface NodeLayoutInfo {
  x: number;
  y: number;
  branchBounds?: BranchBounds;
}

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  nodeWidth: 140,
  minNodeSpacing: 20,
  levelHeight: 100,
  margin: 50,
  labelMargin: 100
};
