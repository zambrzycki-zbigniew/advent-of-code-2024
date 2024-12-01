<template>
    <div>{{ solvePart1(...inputs) }}</div>
    <div>{{ solvePart2(...inputs) }}</div>
</template>

<script setup>

import { solvePart1, solvePart2 } from "./solve.js"

defineProps({
  inputs: {
    type: Array,
    required: true,
  },
  part: {
    type: [Number, null],
    required: false,
    default: null
  },
});

</script>