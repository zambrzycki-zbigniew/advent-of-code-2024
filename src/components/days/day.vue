<template>
  <div class="d-flex">
    <v-card  class="my-1" density="compact">
      <v-card-subtitle class="mt-1 d-flex align-center">
        <!-- <v-icon icon="mdi-check" color="success" /> -->
        <span>Part 1</span></v-card-subtitle
      >
      <v-card-text class="ma-0 pa-1">
        <v-container class="ma-0 pa-0 ml-3" min-width="150px">
          <v-row>
            <v-col>
              <div v-if="result[0]">{{ result[0] }}</div> <v-progress-circular indeterminate v-else/>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card class="my-1 ml-1" density="compact">
      <v-card-subtitle class="mt-1 d-flex align-center">
        <!-- <v-icon icon="mdi-check" color="success" /> -->
        <span>Part 2</span></v-card-subtitle
      >
      <v-card-text class="ma-0 pa-1">
        <v-container class="ma-0 pa-0 ml-3" min-width="150px">
          <v-row>
            <v-col>
              <div v-if="result[1]">{{ result[1] }}</div> <v-progress-circular indeterminate v-else/>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>
  
  <script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";

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
  example: {
    type: Array,
    required: true,
  },
  differentExamples: {
    type: Boolean,
    required: true,
  },
  dataLoaded: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["onExample"]);
const exampleResult = ref([null, null]);

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
    if (event.data.example !== undefined) {
      exampleResult.value = event.data.example;
      emit("onExample", exampleResult.value);
    }
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
    () => [
      props.inputs,
      props.part,
      props.exampleInputs,
      props.differentExamples,
      props.dataLoaded,
    ],
    ([newInputs, newPart, newExample, newDifferentExamples, newDataLoaded]) => {
      if (newInputs && newDataLoaded) {
        isCalculating.value = true;
        worker.postMessage({
          day: props.day,
          inputs: JSON.parse(JSON.stringify(newInputs)),
          example: JSON.parse(JSON.stringify(newExample)),
          part: newPart,
          differentExamples: newDifferentExamples,
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