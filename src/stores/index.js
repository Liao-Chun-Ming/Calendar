import { defineStore } from 'pinia'
import db from '@/firebase/firebaseInit'
import { collection, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'
export const useEventStore = defineStore('eventStore', {
  state: () => ({
    eventData: [],
    eventModal: null,
    editEvent: null,
    currentEventArray: null
  }),
  actions: {
    toggleEvent() {
      this.eventModal = !this.eventModal
    },
    toggleEditEvent() {
      this.editEvent = !this.editEvent
    },
    setEventData(payload) {
      this.eventData.push(payload)
    },
    setCurrentEvent(date) {
      this.currentEventArray = this.eventData.filter((event) => event.eventDate === date)
    },

    async getEvents() {
      const getData = collection(db, 'events')
      const results = await getDocs(getData)
      results.forEach((doc) => {
        const existingEventIndex = this.eventData.findIndex((event) => event.docId === doc.id)
        if (existingEventIndex === -1) {
          const data = {
            docId: doc.id,
            eventId: doc.data().eventId,
            eventDate: doc.data().eventDate,
            eventContentList: doc.data().eventContentList
          }
          this.setEventData(data)
        } else {
          this.eventData[existingEventIndex].eventContentList = doc.data().eventContentList
        }
      })
    },

    async deleteEvent(date, index) {
      const dataBase = doc(collection(db, 'events'), date)
      const eventData = this.eventData.find((event) => event.docId === date)
      const updatedContentList = [...eventData.eventContentList]
      updatedContentList.splice(index, 1)
      if (updatedContentList.length === 0) {
        await deleteDoc(dataBase)
        this.eventData = this.eventData.filter((event) => event.docId !== date)
      } else {
        await updateDoc(dataBase, {
          eventContentList: updatedContentList
        })
      }
    }
  }
})
