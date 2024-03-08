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
import { get } from "firebase/database";

const firestore = getFirestore(fireApp);
const player = collection(firestore, "player");

export interface Player {
  id: string;
  name: string;
  ipAddress?: string;
}

export async function create(data: Player) {
  const result = await setDoc(doc(player, data.id), data);
  return result;
}

export async function getPlayer(id: string) {
  const result = await getDoc(doc(player, id));
  return result.data() || {};
}

export async function getOrCreatePlayer(
  name: string,
  id: string = new Date().getTime().toString()
) {
  const _result = await create({ id, name });
  const result = await getDoc(doc(player, id));
  return result.data() || {};
}
