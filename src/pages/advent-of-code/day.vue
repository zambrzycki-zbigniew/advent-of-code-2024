<template>
  <v-container>
    <v-textarea
      v-model="text"
      label="Input"
      rows="10"
      outlined
      disabled
      placeholder="Paste your day input here..."
    ></v-textarea>
    <DayComponent
      v-if="DayComponent && inputs.length > 0"
      :inputs="inputs"
      :part="part"
      :day="day"
    />
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  day: {
    type: Number,
    required: true,
  },
  part: {
    type: Number,
    required: false,
    default: null,
  },
});

const text = ref("");
const inputs = ref([]);
const DayComponent = shallowRef(null);
const parseInput = ref(null);

const loadDayData = async (day) => {
  try {
    const dayModule = await import(`@/components/days/${day}/day.vue`);
    DayComponent.value = dayModule.default;

    const parseModule = await import(`@/components/days/${day}/parseInput.js`);
    parseInput.value = parseModule.parseInput;

    const fetchUrls = [
      `/advent-of-code-2024/inputs/${day}.txt`,
      `/inputs/${day}.txt`,
    ];

    for (const url of fetchUrls) {
      const response = await fetch(url);
      const fetchedText = await response.text();
      if (!fetchedText.includes("<!DOCTYPE html>")) {
        text.value = fetchedText;
        break;
      }
    }

    inputs.value = parseInput.value(text.value);
  } catch (error) {
    console.error(`Failed to load data for day ${day}:`, error);
  }
};

watch(
  () => props.day,
  async (newDay) => {
    await loadDayData(newDay);
  },
  { immediate: true }
);
</script>
