import { defineStore } from 'pinia';
import {
  fetchEventsFromFirebase,
  updateEventInFirebase,
  deleteEventFromFirebase
} from '@/firebase/eventApi';
export const useEventStore = defineStore('eventStore', {
  state: () => ({
    eventData: [],
    eventModal: false,
    editEvent: false,
    currentEventArray: null
  }),
  actions: {
    toggleEvent() {
      this.eventModal = !this.eventModal;
    },
    toggleEditEvent() {
      this.editEvent = !this.editEvent;
    },
    setEventData(payload) {
      this.eventData.push(payload);
    },
    setCurrentEvent(date) {
      this.currentEventArray = this.eventData.filter((event) => event.eventDate === date);
    },

    async getEvents() {
      const events = await fetchEventsFromFirebase();
      events.forEach((event) => {
        const existingEventIndex = this.eventData.findIndex((e) => e.docId === event.docId);
        if (existingEventIndex === -1) {
          this.setEventData(event);
        } else {
          this.eventData[existingEventIndex].eventContentList = event.eventContentList;
        }
      });
    },

    async deleteEvent(date, index) {
      const eventData = this.eventData.find((event) => event.docId === date);
      const updatedContentList = [...eventData.eventContentList];
      updatedContentList.splice(index, 1);

      if (updatedContentList.length === 0) {
        await deleteEventFromFirebase(date);
        this.eventData = this.eventData.filter((event) => event.docId !== date);
      } else {
        await updateEventInFirebase(date, updatedContentList);
      }
    }
  }
});
