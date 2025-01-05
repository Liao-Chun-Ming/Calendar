<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useEventStore } from '@/stores/index.js'
import EventModal from '@/components/EventModal.vue'
const today = reactive({
  year: 0,
  month: 0,
  date: 0,
  day: 0
})
const calendar = reactive({
  year: 0,
  month: 0,
  date: 0,
  day: 0
})

const currentEvent = ref({})
const eventsStore = useEventStore()

const setToday = () => {
  const date = new Date()
  today.year = calendar.year = date.getFullYear()
  today.month = calendar.month = date.getMonth()
  today.date = calendar.date = date.getDate()
  today.day = calendar.day = date.getDay()
}
const adjustYear = (fix) => {
  calendar.year += fix
}
const adjustMonth = (fix) => {
  let month = calendar.month + fix
  calendar.year += Math.floor(month / 12)
  calendar.month = ((month % 12) + 12) % 12
}

const toggleModal = () => {
  eventsStore.toggleEvent()
}

const toggleEditEvent = (date, index) => {
  eventsStore.toggleEditEvent()
  toggleModal()
  getCurrentEvent(date)

  currentEvent.value = {
    currentIndex: index,
    currentDate: currentEventArray.value[0].eventDate || '',
    currentContent: currentEventArray.value[0].eventContentList[index].content || '',
    currentCategory: currentEventArray.value[0].eventContentList[index].category || ''
  }
}

const getCurrentEvent = (date) => {
  eventsStore.setCurrentEvent(date)
}

const filteredDate = (date) => eventData.value.filter((event) => event.eventDate === date)

const calendarFirstDay = computed(() => {
  const mDate = new Date(calendar.year, calendar.month, 1)
  const date = new Date(calendar.year, calendar.month, 1 - mDate.getDay())
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
    day: date.getDay()
  }
})

const calendarMonth = computed(() => {
  const data = []
  let date
  for (let i = 0; i < 42; i++) {
    date = new Date(
      calendarFirstDay.value.year,
      calendarFirstDay.value.month,
      calendarFirstDay.value.date + i
    )
    data.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate(),
      day: date.getDay()
    })
  }
  return data
})

const eventData = computed(() => eventsStore.eventData)
const eventModal = computed(() => eventsStore.eventModal)
const currentEventArray = computed(() => eventsStore.currentEventArray)

onMounted(() => {
  setToday()
})
</script>
<template>
  <div class="relative h-full flex flex-col">
    <h2 class="text-3xl text-center mb-5">
      {{ calendar.year }}-{{ calendar.month + 1 }}-{{ calendar.date }}
    </h2>
    <div class="flex items-center justify-center gap-5 flex-wrap">
      <button @click="adjustYear(-1)" class="btn btn-sm btn-outline">Last Year</button>
      <button @click="adjustMonth(-1)" class="btn btn-sm btn-outline">Last Month</button>
      <button @click="setToday()" class="btn btn-sm btn-outline">Today</button>
      <button @click="adjustMonth(1)" class="btn btn-sm btn-outline">Next Month</button>
      <button @click="adjustYear(1)" class="btn btn-sm btn-outline">Next Year</button>
    </div>
    <div class="relative w-full p-5">
      <div
        class="flex justify-center items-center text-center text-sm sm:text-lg bg-[#10b981] text-white font-medium rounded-tl-lg rounded-tr-lg"
      >
        <div class="flex-1 px-1 py-2 sm:p-2">Sun.</div>
        <div class="flex-1 px-1 py-2 sm:p-2">Mon.</div>
        <div class="flex-1 px-1 py-2 sm:p-2">Tues.</div>
        <div class="flex-1 px-1 py-2 sm:p-2">Wed.</div>
        <div class="flex-1 px-1 py-2 sm:p-2">Thurs.</div>
        <div class="flex-1 px-1 py-2 sm:p-2">Fri.</div>
        <div class="flex-1 px-1 py-2 sm:p-2">Sat.</div>
      </div>
      <div v-for="i in 6" :key="i" class="flex border-b border-r border-blue-300">
        <div
          v-for="j in 7"
          :key="j"
          :data-date="calendarMonth[(i - 1) * 7 + j - 1].date"
          class="day relative flex-1 min-w-0 min-h-24 border-l border-blue-300 before:border-r before:border-b before:border-blue-300"
          :class="{
            today:
              today.year === calendarMonth[(i - 1) * 7 + j - 1].year &&
              today.month === calendarMonth[(i - 1) * 7 + j - 1].month &&
              today.date === calendarMonth[(i - 1) * 7 + j - 1].date,
            other: calendar.month !== calendarMonth[(i - 1) * 7 + j - 1].month
          }"
        >
          <div
            v-if="
              filteredDate(
                `${calendarMonth[(i - 1) * 7 + j - 1].year}-${String(calendarMonth[(i - 1) * 7 + j - 1].month + 1).padStart(2, '0')}-${String(calendarMonth[(i - 1) * 7 + j - 1].date).padStart(2, '0')}`
              )
            "
            class="w-full flex flex-col gap-1 p-2 mt-[25px]"
          >
            <div
              v-for="(event, index) in filteredDate(
                `${calendarMonth[(i - 1) * 7 + j - 1].year}-${String(calendarMonth[(i - 1) * 7 + j - 1].month + 1).padStart(2, '0')}-${String(calendarMonth[(i - 1) * 7 + j - 1].date).padStart(2, '0')}`
              )[0]?.eventContentList"
              :key="index"
              @click="
                toggleEditEvent(
                  `${calendarMonth[(i - 1) * 7 + j - 1].year}-${String(calendarMonth[(i - 1) * 7 + j - 1].month + 1).padStart(2, '0')}-${String(calendarMonth[(i - 1) * 7 + j - 1].date).padStart(2, '0')}`,
                  index
                )
              "
              class="text-xs rounded-sm border-l-2 px-2 py-0.5 cursor-pointer truncate"
              :class="{
                'bg-[rgba(255,145,0,0.1)] text-[#ff8f00] border-[#ff8f00]':
                  event.category === 'personal',
                'bg-[rgba(0,102,255,0.1)] text-[#0066ff] border-[#0066ff]':
                  event.category === 'work'
              }"
            >
              <span>{{ event.content }}</span>
            </div>
          </div>
        </div>
      </div>
      <button
        @click="toggleModal"
        type="button"
        class="btn bg-[hsl(160,84%,39%)] hover:bg-[#7dddbd] border-none absolute bottom-10 right-[5%] w-12 h-12 text-white flex items-center rounded-full shadow-[0_5px_10px_1px_rgba(100,100,111,0.3)]"
      >
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
    <transition name="event-modal">
      <EventModal v-if="eventModal" :currentevent="currentEvent" />
    </transition>
  </div>
</template>
<style scoped>
.day::before {
  content: attr(data-date);
  width: 30px;
  position: absolute;
  left: 0%;
  top: 0%;
  text-align: center;
  display: block;
}
.today::before {
  background-color: #ff6347;
  color: white;
  border: 1px solid #ff6347;
}
.other {
  background-color: #f8f8f8;
  color: #a9a9a9;
}
.event-modal-enter-active,
.event-modal-leave-active {
  transition: opacity 0.5s ease;
}

.event-modal-enter-from,
.event-modal-leave-to {
  opacity: 0;
}
.event-modal-enter-to,
.event-modal-leave-from {
  opacity: 1;
}
</style>
