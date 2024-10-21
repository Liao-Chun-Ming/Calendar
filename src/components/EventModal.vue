<script setup>
import db from '@/firebase/firebaseInit'
import Loading from '@/components/LoadingAnimation.vue'
import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, computed, watch } from 'vue'
import { useEventStore } from '@/stores/index.js'
import { uid } from 'uid'

const props = defineProps({
  currentevent: {
    type: Object,
    default: () => ({})
  }
})

const selectedDate = ref(null)
const eventContent = ref(null)
const loading = ref(null)
const eventsStore = useEventStore()

const closeEvent = () => {
  eventsStore.toggleEvent()
  if (editEvent.value) {
    eventsStore.toggleEditEvent()
    selectedDate.value = null
    eventContent.value = null
  }
}
const toggleModal = () => {
  eventsStore.toggleEvent()
}

const addEvent = async () => {
  loading.value = true
  const dataBase = doc(collection(db, 'events'), selectedDate.value)
  const docSnap = await getDoc(dataBase)
  const data = {
    id: uid(),
    content: eventContent.value
  }

  if (docSnap.exists()) {
    const existingData = docSnap.data()
    existingData.eventContentList.push(data)
    await updateDoc(dataBase, existingData)
  } else {
    await setDoc(dataBase, {
      eventId: uid(6),
      eventDate: selectedDate.value,
      eventContentList: [data]
    })
  }
  loading.value = false
  selectedDate.value = eventContent.value = null
  toggleModal()
  await eventsStore.getEvents()
}

const updateEvent = async () => {
  loading.value = true
  const dataBase = doc(collection(db, 'events'), selectedDate.value)
  const docSnap = await getDoc(dataBase)
  const existingData = docSnap.data()
  existingData.eventContentList[props.currentevent.index].content = eventContent.value
  await updateDoc(dataBase, existingData)
  loading.value = false
  await eventsStore.getEvents()
  closeEvent()
}

const deleteEvent = async (date, index) => {
  await eventsStore.deleteEvent(date, index)
  eventsStore.getEvents()
  closeEvent()
}

const submitForm = () => {
  if (editEvent.value) {
    updateEvent()
    return
  }
  addEvent()
}

const eventModal = computed(() => eventsStore.eventModal)
const editEvent = computed(() => eventsStore.editEvent)

watch(
  [() => props.currentevent, editEvent],
  ([newCurrentEvent, newEditEvent]) => {
    if (newEditEvent && newCurrentEvent) {
      selectedDate.value = newCurrentEvent.eventDate || null
      eventContent.value = newCurrentEvent.eventContent || null
    } else {
      selectedDate.value = null
      eventContent.value = null
    }
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="flex justify-center p-5">
    <button @click="toggleModal" class="btn btn-neutral bg-black text-white">New Event</button>
    <div v-if="eventModal" class="w-full h-full fixed inset-0 bg-black bg-opacity-50"></div>
    <div
      v-if="eventModal"
      class="absolute left-1/2 top-[30%] -translate-x-1/2 w-96 bg-white flex flex-col items-center justify-between gap-5 shadow-lg rounded-lg py-5"
    >
      <div class="relativew-4/5 flex flex-col gap-5 z-10">
        <Loading v-show="loading" />
        <div class="flex justify-between items-center">
          <div class="w-4"></div>
          <h3 v-if="!editEvent" class="text-xl font-semibold">Add New Event</h3>
          <h3 v-else class="text-xl font-semibold">Edit Event</h3>
          <button
            @click="closeEvent"
            class="w-7 h-7 rounded-full hover:bg-[#EFEFEF] active:bg-[#d5d4d4]"
          >
            <i class="fa-solid fa-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm" class="flex flex-col gap-4">
          <div>
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
          <div class="flex gap-5">
            <button
              v-if="!editEvent"
              type="submit"
              class="btn btn-neutral bg-black text-white flex-1"
            >
              Create Event
            </button>
            <button v-if="editEvent" type="submit" class="btn btn-accent text-white flex-1">
              Update Event
            </button>
          </div>
        </form>
        <button
          v-if="editEvent"
          type="button"
          @click="deleteEvent(selectedDate, currentevent.index)"
          class="btn btn-error text-white flex-1"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
