<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useTodoStore } from '@/stores/todolist.js'
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

const isOpen = ref(false)
const selectedDate = ref('')
const eventContent = ref('')
const eventsStore = useTodoStore()
const addEvent = (date, eventContent) => {
  eventsStore.addEvent(date, eventContent)
  isOpen.value = !isOpen.value
}
const events = computed(() => eventsStore.events)

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

onMounted(() => {
  setToday()
})

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
    //日期超過會自動進到下一個月
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
</script>
<template>
  <div>
    <h2 class="text-3xl text-center mb-5">
      {{ calendar.year }}-{{ calendar.month + 1 }}-{{ calendar.date }}
    </h2>
    <div class="flex items-center justify-center gap-5">
      <button @click="adjustYear(-1)" class="btn btn-sm btn-outline">Last Year</button>
      <button @click="adjustMonth(-1)" class="btn btn-sm btn-outline">Last Month</button>
      <button @click="setToday()" class="btn btn-sm btn-outline">Today</button>
      <button @click="adjustMonth(1)" class="btn btn-sm btn-outline">Next Month</button>
      <button @click="adjustYear(1)" class="btn btn-sm btn-outline">Next Year</button>
    </div>
    <div class="relative w-full p-5">
      <div
        class="flex justify-center items-center text-center text-lg bg-[#10b981] text-white font-medium rounded-tl-lg rounded-tr-lg"
      >
        <div class="flex-1 p-2">Sunday</div>
        <div class="flex-1 p-2">Monday</div>
        <div class="flex-1 p-2">Tuesday</div>
        <div class="flex-1 p-2">Wednesday</div>
        <div class="flex-1 p-2">Thursday</div>
        <div class="flex-1 p-2">Friday</div>
        <div class="flex-1 p-2">Saturday</div>
      </div>
      <div v-for="i in 6" :key="i" class="flex border-b border-r border-blue-300">
        <div
          v-for="j in 7"
          :key="j"
          :data-date="calendarMonth[(i - 1) * 7 + j - 1].date"
          class="day relative flex-1 min-h-24 border-l border-blue-300 before:border-r before:border-b before:border-blue-300"
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
              events[
                `${calendarMonth[(i - 1) * 7 + j - 1].year}-${String(calendarMonth[(i - 1) * 7 + j - 1].month + 1).padStart(2, '0')}-${String(calendarMonth[(i - 1) * 7 + j - 1].date).padStart(2, '0')}`
              ]
            "
            class="flex flex-col gap-1 p-2 mt-[25px]"
          >
            <p
              v-for="(event, index) in events[
                `${calendarMonth[(i - 1) * 7 + j - 1].year}-${String(calendarMonth[(i - 1) * 7 + j - 1].month + 1).padStart(2, '0')}-${String(calendarMonth[(i - 1) * 7 + j - 1].date).padStart(2, '0')}`
              ]"
              :key="index"
              class="bg-black text-white rounded-md px-2 py-1"
            >
              {{ event }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center p-5">
      <button @click="isOpen = !isOpen" class="btn btn-neutral text-white">Add Event</button>
      <div v-if="isOpen" class="w-full h-full fixed inset-0 bg-black bg-opacity-50"></div>
      <div
        v-if="isOpen"
        class="absolute left-1/2 top-[30%] -translate-x-1/2 w-96 bg-white flex flex-col items-center justify-between gap-5 shadow-lg rounded-lg py-5"
      >
        <div class="w-4/5 flex flex-col gap-5 z-10">
          <div class="flex justify-between items-center">
            <div class="w-4"></div>
            <h3 class="text-xl font-semibold">Add New Event</h3>
            <button
              @click="isOpen = !isOpen"
              class="w-7 h-7 rounded-full hover:bg-[#EFEFEF] active:bg-[#d5d4d4]"
            >
              <i class="fa-solid fa-x"></i>
            </button>
          </div>
          <div>
            <label for="formdate">Date:</label>
            <input v-model="selectedDate" type="date" id="formdate" class="w-full rounded-lg" />
          </div>
          <div class="flex flex-col justify-center items-center">
            <label for="textcontent" class="self-start">Events:</label>
            <textarea
              v-model="eventContent"
              name="todo"
              id="textcontent"
              class="w-full h-32 rounded-lg"
            ></textarea>
          </div>
        </div>
        <button @click="addEvent(selectedDate, eventContent)" class="btn btn-neutral text-white">
          Add
        </button>
      </div>
    </div>
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
</style>
