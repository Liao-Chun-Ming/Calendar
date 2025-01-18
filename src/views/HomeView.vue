<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { uid } from 'uid';
import EventModal from '@/components/EventModal.vue';
import Loading from '@/components/LoadingAnimation.vue';
import {
  getEvents,
  getEventByDate,
  updateEvent,
  createEvent,
  deleteEvent
} from '@/firebase/eventApi';

const today = reactive({
  year: 0,
  month: 0,
  date: 0,
  day: 0
});
const calendar = reactive({
  year: 0,
  month: 0,
  date: 0,
  day: 0
});
const loading = ref(false);
const showModal = ref(false);
const isEdit = ref(false);
const eventData = ref([]);
const formData = reactive({
  id: '',
  selectDate: '',
  eventDate: '',
  category: '',
  content: ''
});

const calendarFirstDay = computed(() => {
  const mDate = new Date(calendar.year, calendar.month, 1);
  const date = new Date(calendar.year, calendar.month, 1 - mDate.getDay());
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
    day: date.getDay()
  };
});
const calendarMonth = computed(() => {
  const data = [];
  let date;
  for (let i = 0; i < 42; i++) {
    date = new Date(
      calendarFirstDay.value.year,
      calendarFirstDay.value.month,
      calendarFirstDay.value.date + i
    );
    data.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate(),
      day: date.getDay()
    });
  }
  return data;
});

onMounted(() => {
  setToday();
  getEventData();
});

function setToday() {
  const date = new Date();
  today.year = calendar.year = date.getFullYear();
  today.month = calendar.month = date.getMonth();
  today.date = calendar.date = date.getDate();
  today.day = calendar.day = date.getDay();
}

function adjustYear(fix) {
  calendar.year += fix;
}

function adjustMonth(fix) {
  let month = calendar.month + fix;
  calendar.year += Math.floor(month / 12);
  calendar.month = ((month % 12) + 12) % 12;
}

async function getEventData() {
  eventData.value = await getEvents();
}

function toggleModal() {
  formData.id = '';
  formData.selectDate = '';
  formData.eventDate = '';
  formData.category = '';
  formData.content = '';

  showModal.value = true;
}

function toggleEditEvent(date, index) {
  showModal.value = true;
  isEdit.value = true;

  const data = filteredDate(date)[0];

  formData.id = data.eventContentList[index].id;
  formData.selectDate = data.eventDate;
  formData.eventDate = data.eventDate;
  formData.category = data.eventContentList[index].category;
  formData.content = data.eventContentList[index].content;
}

function filteredDate(date) {
  return eventData.value.filter((event) => event.eventDate === date);
}

async function deleteSingleEvent(date) {
  const data = eventData.value.find((event) => event.docId === date);
  const updateContentList = data.eventContentList.filter((item) => item.id !== formData.id);

  if (updateContentList.length === 0) {
    await deleteEvent(date);
  } else {
    await updateEvent(date, updateContentList);
  }
}

function closeEvent() {
  showModal.value = false;
  isEdit.value = false;
}

async function saveSubmit() {
  if (!formData.selectDate || !formData.category || !formData.content) {
    alert('Please ensure you filled out');
    return;
  }

  loading.value = true;
  const eventDate = formData.selectDate;
  const eventData = {
    id: uid(),
    category: formData.category,
    content: formData.content
  };

  try {
    if (isEdit.value && formData.eventDate !== eventDate) {
      await deleteSingleEvent(formData.eventDate);
    }

    const existingEvent = await getEventByDate(eventDate);

    if (existingEvent) {
      if (isEdit.value && formData.eventDate === eventDate) {
        const updateEvent = existingEvent.eventContentList.find((item) => item.id === formData.id);
        updateEvent.category = eventData.category;
        updateEvent.content = eventData.content;
      } else {
        existingEvent.eventContentList.push(eventData);
      }

      await updateEvent(eventDate, existingEvent.eventContentList);
    } else {
      await createEvent(eventDate, {
        eventId: uid(6),
        eventDate,
        eventContentList: [eventData]
      });
    }

    await getEventData();
  } catch (error) {
    console.error('Error saving event:', error);
  } finally {
    loading.value = false;
    showModal.value = false;
    isEdit.value = false;
  }
}

async function deleteSubmit() {
  loading.value = true;

  await deleteSingleEvent(formData.eventDate);
  await getEventData();

  loading.value = false;
  showModal.value = false;
  isEdit.value = false;
}
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
        aria-label="btn_add"
        class="btn bg-[hsl(160,84%,39%)] hover:bg-[#7dddbd] border-none absolute bottom-10 right-[5%] w-12 h-12 text-white flex items-center rounded-full shadow-[0_5px_10px_1px_rgba(100,100,111,0.3)]"
      >
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
    <transition name="event-modal">
      <EventModal
        v-model:formData="formData"
        :isOpen="showModal"
        :isEdit="isEdit"
        @update:isOpen="closeEvent"
        @save="saveSubmit"
        @delete="deleteSubmit"
      />
    </transition>
  </div>
  <Loading v-show="loading" />
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
