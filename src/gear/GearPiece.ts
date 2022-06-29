export type ArmorType = "Cloth" | "Leather" | "Mail" | "Plate";
export type WeaponType = "TwoHandAxe";
export type SlotType = "Legs" | "Chest" | "Head" | "Neck" | "TwoHand";
export type BindType = "BoP" | "BoE";
export type SocketColor = "Red" | "Blue" | "Yellow" | "Meta";
export type QualityType = "Common" | "Rare" | "Epic" | "Legendary";

export interface SpecialEffect {
  Trigger: string;
  Stats: Stats;
  Duration: number;
  Cooldown: number;
  Chance: number;
  MaxStack: number;
}

export interface SpecialEffects {
  SpecialEffects: { SpecialEffect: SpecialEffect[] }; 
}

export interface Stats {
  Armor?: number;
  BonusArmor?: number;
  Stamina?: number;
  Strength?: number;
  Agility?: number;
  Intellect?: number;
  Spirit?: number;
  AttackPower?: number;
  SpellPower?: number;
  HealPower?: number;
  HitRating?: number;
  DodgeRating?: number;
  CritRating?: number;
  Resilience?: number;

  ShadowDamage: number;
}

export interface GearPiece {
  Id: number;
  Name: string;
  Slot: SlotType;
  ItemLevel: number;
  DisplayId: number;
  DisplaySlot: number;
  IconPath: string;
  Stats: Stats & SpecialEffects | "";
  Quality: QualityType;
  Type: ArmorType | WeaponType;
  RequiredClasses: string;
  Faction: string;
  Bind: BindType;
  Unique?: boolean
  SocketColor1?: SocketColor;
  SocketColor2?: SocketColor;
  SocketColor3?: SocketColor;
  SocketBonus: Stats | "";
  SetName?: string;
}