export type Races = 'human' | 'gnome' | 'nightelf' | 'draenei';
export type Genders = 'male' | 'female';
export type Classes = "warrior" | "paladin" | "rogue" | "deathknight" | "mage" | "warlock" | "priest" | "hunter" | "druid";

export interface Character {
  name: string;
  race: Races;
  gender: Genders;
  class: Classes;
  spec: string;
}