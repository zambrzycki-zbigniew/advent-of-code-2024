<template>
  <div>
    Part 1: <span v-if="result[0]">{{ result[0] }}</span>
  </div>
  <div>
    Part 2: <span v-if="result[1]">{{ result[1] }}</span>
  </div>
  <div v-if="isCalculating">Calculating...</div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";

const props = defineProps({
  inputs: {
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

const result = ref([null, null]);
const isCalculating = ref(false);
let worker;

onMounted(() => {
  worker = new Worker(new URL("@/workers/solveWorker.js", import.meta.url), {
    type: "module",
  });

  worker.onmessage = (event) => {
    isCalculating.value = false;
    console.log(event);
    if (event.data.result !== undefined) {
      result.value = event.data.result;
    } else if (event.data.error) {
      console.error(event.data.error);
    }
  };

  worker.onerror = (error) => {
    console.error("Worker error:", error);
    isCalculating.value = false;
  };

  watch(
    () => [props.inputs, props.part],
    ([newInputs, newPart]) => {
      if (newInputs) {
        isCalculating.value = true;
        worker.postMessage({
          day: props.day,
          inputs: JSON.parse(JSON.stringify(newInputs)),
          part: newPart,
        });
      }
    },
    { immediate: true, deep: true }
  );
});

onUnmounted(() => {
  worker.terminate();
});
</script>