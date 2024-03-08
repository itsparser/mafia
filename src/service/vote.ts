import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  getDoc,
  increment,
} from "firebase/firestore";
import fireApp from ".";

const firestore = getFirestore(fireApp);
const voteTable = collection(firestore, "vote");

export async function vote(id: string) {
  let inc = increment(1);
  const result = await setDoc(doc(voteTable, id), { result: inc });
  return result;
}

export async function get(id: string) {
  const result = await getDoc(doc(voteTable, id));
  return result.data() || {};
}
