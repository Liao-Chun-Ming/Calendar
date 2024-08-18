import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todoStore', {
  state: () => ({
    events: JSON.parse(localStorage.getItem('calendarEvents')) || {}
  }),
  actions: {
    addEvent(date, eventContent) {
      if (!this.events[date]) {
        this.events[date] = []
      }
      this.events[date].push(eventContent)
      this.saveEvents()
    },
    removeEvent(date, eventIndex) {
      if (this.events[date]) {
        this.events[date].splice(eventIndex, 1)
        this.saveEvents()
      }
    },
    saveEvents() {
      localStorage.setItem('calendarEvents', JSON.stringify(this.events))
    }
  }
})
