export interface PricePoint {
  marketValue: number;
  minBuyout: number;
  quantity: number;
  scannedAt: string;
}

export interface MarketItem {
  itemId: number,
  name: string,
  uniqueName: string,
  slug: string,
  timerange: number,
  data: PricePoint[]
}