export interface ISong {
  id: number; // primary key
  title: string; // not null
  group: string; // not null
  year: number;  // not null
  gender: string; // not null
  id_favorite: number; // not null
  //last_updated: Date; // not null

}
