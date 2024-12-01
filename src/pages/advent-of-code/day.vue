<template>
  <v-container>
    <v-textarea
      v-model="text"
      label="Day input"
      rows="10"
      outlined
      placeholder="Paste your day input here..."
    ></v-textarea>

    <v-btn class="mt-4" color="primary" @click="handleText"> Submit </v-btn>
    <DayComponent v-if="inputs.length > 0" :inputs="inputs" />
  </v-container>
</template>
  
  <script setup>
import { ref } from "vue";

defineProps({
  day: {
    type: Number,
    required: true,
  },
  solution: {
    type: Number,
    required: false,
    default: null
  },
});

const text = ref("");
const inputs = ref([]);

let DayComponent = null;
let parseInput = null;

const loadDayModule = async () => {
  const dayModule = await import(`@/components/days/${day}/day.vue`);
  const parseModule = await import(
    `@/components/days/${day}/parseInput.js`
  );

  DayComponent = dayModule.default;
  parseInput = parseModule.parseInput;
};

const handleText = async () => {
  if (!DayComponent || !parseInput) {
    await loadDayModule();
  }

  inputs.value = parseInput(text.value);
};
</script>
  
  <style scoped>
.mt-4 {
  margin-top: 1rem;
}
</style>
  