<template>
  <DayComponent :inputs="inputs" :exampleInputs="exampleInputs" :part="part" :day="day" :example="example" @onExample="passExampleResults"/>
</template>

<script setup>

const example = ref([11, 31]);

import DayComponent from "../day.vue"
const props = defineProps({
  inputs: {
    type: Array,
    required: true,
  },
  exampleInputs: {
    type: Array,
    required: true,
  },
  part: {
    type: [Number, null],
    required: false,
    default: null,
  },
  day: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['onExample']);
let exampleResults = [[null, 0], [null, 0]]
function passExampleResults(results) {
  exampleResults = [[results[0], example.value[0]], [results[1], example.value[1]]]
  emit('onExample', exampleResults)
}
</script>