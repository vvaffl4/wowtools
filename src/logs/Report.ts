export interface Owner {
  name: string
}

export interface Actor {
  gameID: number;
  id: number;
  name: string;
}

export interface RankedCharacter {
  id: number;
  classID: number;
  name: string;
}

export interface Event {
  abilityGameID: number;
  fight: number;
  sourceID: number;
  targetID: number;
  timestamp: number;
  type: string;
  sourceMarker?: number;
}

export interface EventData {
  data: Event[]
}

export interface Guild {
  name: string
}

export interface MasterData {
  gameVersion: number;
  actors: Actor[];
}

export interface Report {
  guild: Guild;
  masterData: MasterData;
  events: EventData;
  title: string;
  owner: Owner;
  fights: object[];
  rankedCharacters: RankedCharacter[]
}