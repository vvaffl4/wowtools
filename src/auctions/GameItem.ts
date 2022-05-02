
export interface GameItemTooltip {
  label: string;
  format: string;
}

export interface GameItemAuction {
  marketValue: number;
  historicalValue: number;
  minBuyout: number;
  numAuctions: number;
  quantity: number;
}

export interface GameItemStats {
  lastUpdated: string;
  current: GameItemAuction;
  previous: GameItemAuction;
}

export interface GameItem {
  server: string;
  itemId: string;
  name: string;
  uniqueName: string;
  icon: string;
  tags: string[];
  requiredLevel: number;
  itemLevel: number;
  sellPrice: number;
  vendorPrice: number | null;
  tooltip: GameItemTooltip[];
  itemLink: string;
  stats: GameItemStats;
}