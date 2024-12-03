<template>
  <Transition name="fade" mode="out-in">
    <v-container v-if="dataLoaded">
      <div v-if="!differentExamples && exampleText">
        <v-textarea
          v-model="exampleText"
          hide-details
          label="Example"
          :rows="exampleText.split('\n').length"
          outlined
          disabled
        ></v-textarea>
        <div class="d-flex">
          <v-card v-if="exampleResults[0]" class="my-1 mr-1" density="compact">
            <v-card-subtitle class="mt-1 pl-0 d-flex align-center">
              <v-icon
                v-if="exampleResults[0][0] === exampleResults[0][1]"
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
                    <div>{{ exampleResults[0][1] }}</div>
                    <div
                      :style="{
                        color:
                          exampleResults[0][0] === exampleResults[0][1]
                            ? 'lime'
                            : 'red',
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
                v-if="exampleResults[1][0] === exampleResults[1][1]"
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
                    <div>{{ exampleResults[1][1] }}</div>
                    <div
                      :style="{
                        color:
                          exampleResults[1][0] === exampleResults[1][1]
                            ? 'lime'
                            : 'red',
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
          outlined
          disabled
        ></v-textarea>
        <div class="d-flex">
          <v-card v-if="exampleResults[0]" class="my-1" density="compact">
            <v-card-subtitle class="mt-1 pl-0 d-flex align-center">
              <v-icon
                v-if="exampleResults[0][0] === exampleResults[0][1]"
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
                    <div>{{ exampleResults[0][1] }}</div>
                    <div
                      :style="{
                        color:
                          exampleResults[0][0] === exampleResults[0][1]
                            ? 'lime'
                            : 'red',
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
          outlined
          disabled
        ></v-textarea>
        <div class="d-flex">
          <v-card v-if="exampleResults[1]" class="my-1" density="compact">
            <v-card-subtitle class="mt-1 pl-0 d-flex align-center">
              <v-icon
                v-if="exampleResults[1][0] === exampleResults[1][1]"
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
                    <div>{{ exampleResults[1][1] }}</div>
                    <div
                      :style="{
                        color:
                          exampleResults[1][0] === exampleResults[1][1]
                            ? 'lime'
                            : 'red',
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
        @onExample="handleExampleResults"
      />
    </v-container>
  </Transition>
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
const exampleText = ref("");
const exampleTexts = ref(["", ""]);
const inputs = ref([]);
const exampleInputs = ref([]);
const DayComponent = shallowRef(null);
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
    const dayModule = await import(`@/components/days/${day}/day.vue`);
    DayComponent.value = dayModule.default;

    const parseModule = await import(`@/components/days/${day}/parseInput.js`);
    parseInput.value = parseModule.parseInput;

    const fetchUrls = [
      `/advent-of-code-2024/inputs/${day}.txt`,
      `/inputs/${day}.txt`,
    ];
    const fetchExampleUrls = [
      `/advent-of-code-2024/inputs/${day}example.txt`,
      `/inputs/${day}example.txt`,
    ];
    const fetchExamplePart1Urls = [
      `/advent-of-code-2024/inputs/${day}example1.txt`,
      `/inputs/${day}example1.txt`,
    ];
    const fetchExamplePart2Urls = [
      `/advent-of-code-2024/inputs/${day}example2.txt`,
      `/inputs/${day}example2.txt`,
    ];

    for (const url of fetchUrls) {
      const response = await fetch(url);
      const fetchedText = await response.text();
      if (!fetchedText.includes("<!DOCTYPE html>")) {
        text.value = fetchedText;
      }
    }

    for (const url of fetchExampleUrls) {
      const response = await fetch(url);
      const fetchedText = await response.text();
      if (!fetchedText.includes("<!DOCTYPE html>")) {
        exampleText.value = fetchedText;
        break;
      }
    }

    if (exampleText.value === "") {
      differentExamples.value = true;
      for (const url of fetchExamplePart1Urls) {
        const response = await fetch(url);
        const fetchedText = await response.text();
        if (!fetchedText.includes("<!DOCTYPE html>")) {
          exampleTexts.value[0] = fetchedText;
          break;
        }
      }
      for (const url of fetchExamplePart2Urls) {
        const response = await fetch(url);
        const fetchedText = await response.text();
        if (!fetchedText.includes("<!DOCTYPE html>")) {
          exampleTexts.value[1] = fetchedText;
          break;
        }
      }
    }

    inputs.value = parseInput.value(text.value);
    console.log("differentExamples.value", differentExamples.value);
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
</style>
