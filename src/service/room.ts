import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import fireApp from ".";

const firestore = getFirestore(fireApp);
const table = collection(firestore, "room");
const session = collection(firestore, "session");

export interface Room {
  id: string;
  roundDuration: number;
  playerCount: number;
  createdBy: string;
  currentSession?: string;
}

export interface Session {
  id?: string;
  room_id: string;
  status: string;
  players: Array<PlayerCard>;
  mafias: Array<PlayerCard>;
  // doctors: Array<string>;
  villagers: Array<PlayerCard>;
  totalPlayers: number;
  mafiaCount: number;
  villageCount: number;
  round: number;
  createdBy: string;
  createdAt: Date;
  winner?: string;
}

export interface PlayerCard {
  id: string;
  name: string;
  isAlive: boolean;
}

export async function create(data: Room) {
  const result = await setDoc(doc(table, data.id), data);
  return result;
}

export async function get(id: string) {
  const result = await getDoc(doc(table, id));
  return result.data() || {};
}

export async function createSession(data: Session) {
  const result = await addDoc(session, data);
  return result;
}

export async function updateSession(id: string, data: Partial<Session>) {
  const result = await setDoc(doc(session, id), data);
  return result;
}

export async function getSession(id: string) {
  const result = await getDoc(doc(session, id));
  return result.data() || {};
}
