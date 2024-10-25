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
const eventCategory = ref(null)
const loading = ref(null)
const eventsStore = useEventStore()

const toggleModal = () => {
  eventsStore.toggleEvent()
}
const closeEvent = () => {
  toggleModal()
  if (editEvent.value) {
    eventsStore.toggleEditEvent()
  }
  selectedDate.value = null
  eventContent.value = null
  eventCategory.value = null
}

const saveEvent = async () => {
  if (!selectedDate.value || !eventContent.value || !eventCategory.value) {
    alert('Please ensure you filled out')
    return
  }

  loading.value = true
  const eventDate = selectedDate.value
  const eventData = {
    id: uid(),
    category: eventCategory.value,
    content: eventContent.value
  }

  const dataBase = doc(collection(db, 'events'), eventDate)
  const docSnap = await getDoc(dataBase)

  if (editEvent.value && props?.currentevent.currentDate !== eventDate) {
    await eventsStore.deleteEvent(props.currentevent.currentDate, props.currentevent.currentIndex)
  }

  if (docSnap.exists()) {
    const existingData = docSnap.data()
    if (editEvent.value && props?.currentevent.currentDate === eventDate) {
      existingData.eventContentList[props.currentevent.currentIndex].content = eventData.content
      existingData.eventContentList[props.currentevent.currentIndex].category = eventData.category
    } else {
      existingData.eventContentList.push(eventData)
    }
    await updateDoc(dataBase, existingData)
  } else {
    await setDoc(dataBase, {
      eventId: uid(6),
      eventDate: selectedDate.value,
      eventContentList: [eventData]
    })
  }
  loading.value = false
  await eventsStore.getEvents()
  closeEvent()
}

const deleteEvent = async (date, index) => {
  loading.value = true
  await eventsStore.deleteEvent(date, index)
  await eventsStore.getEvents()
  loading.value = false
  closeEvent()
}

const submitForm = () => {
  saveEvent()
}

const editEvent = computed(() => eventsStore.editEvent)

watch(
  [() => props.currentevent, editEvent],
  ([newCurrentEvent, newEditEvent]) => {
    if (newEditEvent && newCurrentEvent) {
      selectedDate.value = newCurrentEvent.currentDate || null
      eventContent.value = newCurrentEvent.currentContent || null
      eventCategory.value = newCurrentEvent.currentCategory || null
    } else {
      selectedDate.value = null
      eventContent.value = null
      eventCategory.value = null
    }
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="flex justify-center p-5">
    <div class="w-full h-full fixed inset-0 bg-black bg-opacity-50"></div>
    <div
      class="absolute left-1/2 top-[20%] -translate-x-1/2 min-w-[336px] sm:min-w-96 bg-white flex flex-col items-center justify-between gap-5 shadow-lg rounded-lg py-5"
    >
      <Loading v-show="loading" />
      <div class="w-4/5 flex flex-col gap-5 z-10">
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
          <div class="flex flex-col gap-2">
            <div>
              <label for="formdate">Date:</label>
              <input v-model="selectedDate" type="date" id="formdate" class="w-full rounded-lg" />
            </div>
            <div>
              <label for="formCategory">Category:</label>
              <select v-model="eventCategory" id="formCategory" class="w-full rounded-lg">
                <option value="personal">Personal</option>
                <option value="work">Work</option>
              </select>
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
              class="btn bg-[#10b981] hover:bg-[#7dddbd] border-none text-white flex-1"
            >
              Create Event
            </button>
            <button v-if="editEvent" type="submit" class="btn btn-warning text-white flex-1">
              Update Event
            </button>
            <button
              v-if="editEvent"
              type="button"
              @click="deleteEvent(selectedDate, currentevent.index)"
              class="btn btn-error text-white flex-1"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
