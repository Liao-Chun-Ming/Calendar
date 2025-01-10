import db from '@/firebase/firebaseInit';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const eventsCollection = collection(db, 'events');

export const fetchEventsFromFirebase = async () => {
  const results = await getDocs(eventsCollection);
  return results.docs.map((doc) => ({
    docId: doc.id,
    ...doc.data()
  }));
};

export const fetchEventByDate = async (date) => {
  const dataBase = doc(eventsCollection, date);
  const docSnap = await getDoc(dataBase);
  return docSnap.exists() ? docSnap.data() : false;
};

export const saveEventToFirebase = async (date, data) => {
  const dataBase = doc(eventsCollection, date);
  await setDoc(dataBase, data);
};

export const updateEventInFirebase = async (date, updatedContentList) => {
  const dataBase = doc(eventsCollection, date);
  await updateDoc(dataBase, { eventContentList: updatedContentList });
};

export const deleteEventFromFirebase = async (date) => {
  const dataBase = doc(eventsCollection, date);
  await deleteDoc(dataBase);
};
