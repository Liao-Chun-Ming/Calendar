<script setup>
import { computed } from 'vue';

const props = defineProps({
  formData: {
    type: Object,
    default: () => ({})
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['update:isOpen', 'update:formData', 'save', 'delete']);

const data = computed({
  get: () => props.formData,
  set: (newValue) => emit('update:formData', newValue)
});

function handleClose() {
  emit('update:isOpen', false);
}

function handleAction(action) {
  emit(action);
}
</script>

<template>
  <div v-if="isOpen" class="flex justify-center p-5">
    <div class="w-full h-full fixed inset-0 bg-black bg-opacity-50"></div>
    <div
      class="absolute left-1/2 top-[20%] -translate-x-1/2 min-w-[336px] sm:min-w-96 bg-white flex flex-col items-center justify-between gap-5 shadow-lg rounded-lg py-5"
    >
      <div class="w-4/5 flex flex-col gap-5 z-10">
        <div class="flex justify-between items-center">
          <div class="w-4"></div>
          <h3 v-if="!isEdit" class="text-xl font-semibold">Add New Event</h3>
          <h3 v-else class="text-xl font-semibold">Edit Event</h3>
          <button
            @click="handleClose"
            class="w-7 h-7 rounded-full hover:bg-[#EFEFEF] active:bg-[#d5d4d4]"
          >
            <i class="fa-solid fa-x"></i>
          </button>
        </div>
        <form @submit.prevent="handleAction('save')" class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <div>
              <label for="formdate">Date:</label>
              <input
                v-model="data.selectDate"
                type="date"
                id="formdate"
                class="w-full rounded-lg"
              />
            </div>
            <div>
              <label for="formCategory">Category:</label>
              <select v-model="data.category" id="formCategory" class="w-full rounded-lg">
                <option value="personal">Personal</option>
                <option value="work">Work</option>
              </select>
            </div>
            <div class="flex flex-col justify-center items-center">
              <label for="textcontent" class="self-start">Events:</label>
              <textarea
                v-model="data.content"
                name="todo"
                id="textcontent"
                class="w-full h-32 rounded-lg"
              ></textarea>
            </div>
          </div>
          <div class="flex gap-5">
            <button
              v-if="!isEdit"
              type="submit"
              class="btn bg-[#10b981] hover:bg-[#7dddbd] border-none text-white flex-1"
            >
              Create Event
            </button>
            <button v-if="isEdit" type="submit" class="btn btn-warning text-white flex-1">
              Update Event
            </button>
            <button
              v-if="isEdit"
              type="button"
              @click="handleAction('delete')"
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
