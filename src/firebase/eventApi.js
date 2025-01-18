import db from '@/firebase/firebaseInit';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const eventsCollection = collection(db, 'events');

export async function getEvents() {
  const results = await getDocs(eventsCollection);
  return results.docs.map((doc) => ({
    docId: doc.id,
    ...doc.data()
  }));
}

export async function getEventByDate(date) {
  const dataBase = doc(eventsCollection, date);
  const docSnap = await getDoc(dataBase);
  return docSnap.exists() ? docSnap.data() : false;
}

export async function createEvent(date, data) {
  const dataBase = doc(eventsCollection, date);
  await setDoc(dataBase, data);
}

export async function updateEvent(date, updateContentList) {
  const dataBase = doc(eventsCollection, date);
  await updateDoc(dataBase, { eventContentList: updateContentList });
}

export async function deleteEvent(date) {
  const dataBase = doc(eventsCollection, date);
  await deleteDoc(dataBase);
}
