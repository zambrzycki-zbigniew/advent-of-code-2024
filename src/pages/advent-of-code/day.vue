<template>
  <Transition name="fade" mode="out-in">
    <v-container v-if="dataLoaded">
      <div v-if="!differentExamples && exampleText">
        <v-textarea
          v-model="exampleText"
          hide-details
          label="Example"
          :rows="exampleText.split('\n').length"
          class="monospaced-textarea"
          outlined
          disabled
        ></v-textarea>
        <div class="d-flex">
          <v-card v-if="exampleResults[0]" class="my-1 mr-1" density="compact">
            <v-card-subtitle class="mt-1 pl-0 d-flex align-center">
              <v-icon
                v-if="exampleResults[0][0] === examples[0]"
                icon="mdi-check"
                color="success"
              />
              <v-icon v-else icon="mdi-close" color="red" />
              <span>Part 1</span></v-card-subtitle
            >
            <v-card-text class="ma-0 pa-1">
              <v-container class="ma-0 pa-0 ml-3" min-width="150px">
                <v-row>
                  <v-col>
                    <div>Expected</div>
                    <div>Calculated</div>
                  </v-col>
                  <v-col>
                    <div>{{ examples[0] }}</div>
                    <div
                      :style="{
                        color:
                          exampleResults[0][0] === examples[0] ? 'lime' : 'red',
                      }"
                    >
                      {{ exampleResults[0][0] }}
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>

          <v-card v-if="exampleResults[1]" class="my-1" density="compact">
            <v-card-subtitle class="mt-1 pl-0 d-flex align-center">
              <v-icon
                v-if="exampleResults[1][0] === examples[1]"
                icon="mdi-check"
                color="success"
              />
              <v-icon v-else icon="mdi-close" color="red" />
              <span>Part 2</span></v-card-subtitle
            >
            <v-card-text class="ma-0 pa-1">
              <v-container class="ma-0 pa-0 ml-3" min-width="150px">
                <v-row>
                  <v-col>
                    <div>Expected</div>
                    <div>Calculated</div>
                  </v-col>
                  <v-col>
                    <div>{{ examples[1] }}</div>
                    <div
                      :style="{
                        color:
                          exampleResults[1][0] === examples[1] ? 'lime' : 'red',
                      }"
                    >
                      {{ exampleResults[1][0] }}
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </div>
      </div>
      <div v-else>
        <v-textarea
          v-if="exampleTexts[0]"
          hide-details
          v-model="exampleTexts[0]"
          label="Example 1"
          :rows="exampleTexts[0].split('\n').length"
          class="monospaced-textarea"
          outlined
          disabled
        ></v-textarea>
        <div class="d-flex">
          <v-card v-if="exampleResults[0]" class="my-1" density="compact">
            <v-card-subtitle class="mt-1 pl-0 d-flex align-center">
              <v-icon
                v-if="exampleResults[0][0] === examples[0]"
                icon="mdi-check"
                color="success"
              />
              <v-icon v-else icon="mdi-close" color="red" />
              <span>Part 1</span></v-card-subtitle
            >
            <v-card-text class="ma-0 pa-1">
              <v-container class="ma-0 pa-0 ml-3" min-width="150px">
                <v-row>
                  <v-col>
                    <div>Expected</div>
                    <div>Calculated</div>
                  </v-col>
                  <v-col>
                    <div>{{ examples[0] }}</div>
                    <div
                      :style="{
                        color:
                          exampleResults[0][0] === examples[0] ? 'lime' : 'red',
                      }"
                    >
                      {{ exampleResults[0][0] }}
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </div>
        <v-textarea
          v-if="exampleTexts[1]"
          hide-details
          v-model="exampleTexts[1]"
          label="Example 2"
          :rows="exampleTexts[1].split('\n').length"
          class="monospaced-textarea"
          outlined
          disabled
        ></v-textarea>
        <div class="d-flex">
          <v-card v-if="exampleResults[1]" class="my-1" density="compact">
            <v-card-subtitle class="mt-1 pl-0 d-flex align-center">
              <v-icon
                v-if="exampleResults[1][0] === examples[1]"
                icon="mdi-check"
                color="success"
              />
              <v-icon v-else icon="mdi-close" color="red" />
              <span>Part 2</span></v-card-subtitle
            >
            <v-card-text class="ma-0 pa-1">
              <v-container class="ma-0 pa-0 ml-3" min-width="150px">
                <v-row>
                  <v-col>
                    <div>Expected</div>
                    <div>Calculated</div>
                  </v-col>
                  <v-col>
                    <div>{{ examples[1] }}</div>
                    <div
                      :style="{
                        color:
                          exampleResults[1][0] === examples[1] ? 'lime' : 'red',
                      }"
                    >
                      {{ exampleResults[1][0] }}
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </div>
      </div>
      <v-btn
        class="mt-0"
        prepend-icon="mdi-content-copy"
        @click="copyToClipboard"
        >copy input to clipboard</v-btn
      >
      <Transition name="fade" mode="out-in">
        <v-alert
          v-if="copySuccess"
          type="success"
          border="start"
          position="absolute"
          location="bottom right"
        >
          Input copied to clipboard!
        </v-alert>
      </Transition>
      <v-textarea
        v-model="text"
        hide-details
        label="Input"
        class="monospaced-textarea"
        rows="10"
        outlined
        disabled
      ></v-textarea>
      <DayComponent
        v-if="DayComponent && inputs.length > 0"
        :inputs="inputs"
        :exampleInputs="exampleInputs"
        :part="part"
        :day="day"
        :differentExamples="differentExamples"
        :dataLoaded="dataLoaded"
        :rawInput="text"
        @onExample="handleExampleResults"
      />
    </v-container>
  </Transition>
</template>

<script setup>
import { ref, watch } from "vue";
import DayComponent from "@/components/days/day.vue";

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
  examples: {
    type: Array,
    required: true,
  },
});

const text = ref("");
const exampleText = ref("");
const exampleTexts = ref(["", ""]);
const inputs = ref([]);
const exampleInputs = ref([]);
// const DayComponent = shallowRef(null);
const parseInput = ref(null);
const differentExamples = ref(false);
const dataLoaded = ref(false);
const exampleResults = ref([
  [null, 0],
  [null, 0],
]);

const copySuccess = ref(false);

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(text.value);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy text: ", error);
  }
};

const handleExampleResults = ref((results) => (exampleResults.value = results));

const loadDayData = async (day) => {
  dataLoaded.value = false;
  let transitionResolve,
    transitionPromise = new Promise((r) => (transitionResolve = r));
  setTimeout(() => {
    transitionResolve();
  }, 300);
  differentExamples.value = false;
  exampleText.value = "";
  exampleTexts.value = ["", ""];
  try {
    const parseModule = await import(`@/components/days/${day}/parseInput.js`);
    parseInput.value = parseModule.parseInput;
    const inputUrl =
      process.env.NODE_ENV === "production"
        ? `/advent-of-code-2024/inputs/${day}.txt`
        : `/inputs/${day}.txt`;
    const exampleUrl =
      process.env.NODE_ENV === "production"
        ? `/advent-of-code-2024/inputs/${day}example.txt`
        : `/inputs/${day}example.txt`;
    const examplePart1Url =
      process.env.NODE_ENV === "production"
        ? `/advent-of-code-2024/inputs/${day}example1.txt`
        : `/inputs/${day}example1.txt`;
    const examplePart2Url =
      process.env.NODE_ENV === "production"
        ? `/advent-of-code-2024/inputs/${day}example2.txt`
        : `/inputs/${day}example2.txt`;
    text.value = await (await fetch(inputUrl)).text();
    exampleText.value = await (await fetch(exampleUrl))
      .text()
      .catch(() => null);
    exampleTexts.value[0] = await (await fetch(examplePart1Url))
      .text()
      .catch(() => null);
    exampleTexts.value[1] = await (await fetch(examplePart2Url))
      .text()
      .catch(() => null);
    differentExamples.value =
      !!exampleTexts.value[0] &&
      !exampleTexts.value[0].includes("<!DOCTYPE html>") &&
      !!exampleTexts.value[1] &&
      !exampleTexts.value[1].includes("<!DOCTYPE html>");
    inputs.value = parseInput.value(text.value);
    if (differentExamples.value)
      exampleInputs.value = [
        parseInput.value(exampleTexts.value[0]),
        parseInput.value(exampleTexts.value[1]),
      ];
    else exampleInputs.value = parseInput.value(exampleText.value);
    transitionPromise.then(() => (dataLoaded.value = true));
  } catch (error) {
    console.error(`Failed to load data for day ${day}:`, error);
  }
  console.log(props.examples);
};

watch(
  () => props.day,
  async (newDay) => {
    await loadDayData(newDay);
  },
  { immediate: true }
);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.monospaced-textarea textarea {
  font-family: 'Courier New', Courier, monospace;
}
</style>
