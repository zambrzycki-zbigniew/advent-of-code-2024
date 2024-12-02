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
    <DayComponent v-if="inputs.length > 0" :inputs="inputs" :part="part" :day="day"/>
  </v-container>
</template>
  
<script setup>
  import { ref } from "vue";

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

  let DayComponent = null;
  let parseInput = null;

  (async () => {
    DayComponent = (await import(`@/components/days/${props.day}/day.vue`)).default
    parseInput = (await import(`@/components/days/${props.day}/parseInput.js`)).parseInput
    try {
      text.value = await (await fetch(`/inputs/${props.day}.txt`)).text()
    } catch(err) {
      console.log("tutaj kurwa", err)
    }
    inputs.value = parseInput(text.value);
  })()
</script>