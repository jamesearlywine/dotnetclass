import { Photo } from "./photo";

export interface UserForLogin {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  knownAs: string;
  age: number;
  gender: string;
  created: Date;
  lastActive: Date;
  photoUrl: string;
  city: string;
  country: string;
  interests?: string;
  introduction?: string;
  lookingFor?: string;
  photos?: Photo[];
}
