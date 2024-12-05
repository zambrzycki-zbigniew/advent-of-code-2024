<template>
  <v-app>
    <v-navigation-drawer app :rail="rail" permanent @click="rail = false">
      <v-list-item prepend-icon="mdi-home" :to="`/`">
        <template v-slot:append>
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            @click.stop.prevent="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>
      <v-list density="compact">
        <v-list-item
          min-height="32"
          v-for="day in dayNumbers"
          :key="day"
          :to="days.includes(day) ? `/days/${day}` : null"
          :disabled="!days.includes(day)"
          link
        >
          <v-list-item-title v-if="!rail" class="d-flex justify-space-between">
            Day {{ day }}
            <span>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    :color="getStarColor(day, 1).color"
                    icon="mdi-star"
                  />
                </template>
                <template v-slot:default>
                  {{ getStarColor(day, 1).time }}
                </template>
              </v-tooltip>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    :color="getStarColor(day, 2).color"
                    icon="mdi-star"
                  />
                </template>
                <template v-slot:default>
                  {{ getStarColor(day, 2).time }}
                </template>
              </v-tooltip>
            </span>
          </v-list-item-title>
          <v-list-item-title v-else>{{ day }}</v-list-item-title>
          <template v-slot:append>
            <v-btn
              density="compact"
              color="transparent"
              :disabled="false"
              v-if="isDev && !rail"
              :icon="days.includes(day) ? 'mdi-pencil' : 'mdi-plus'"
              @click.stop="openDialog(day)"
              style="pointer-events: auto"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-dialog v-model="dialogVisible" max-width="600">
      <v-card>
        <v-card-title>Edit Day {{ dialogDay }}</v-card-title>
        <v-card-text>
          <v-textarea
            label="Input"
            v-model="dialogData.input"
            outlined
          ></v-textarea>
          <v-textarea
            label="Example 1"
            v-model="dialogData.example1"
            outlined
          ></v-textarea>
          <v-textarea
            label="Example 2"
            v-model="dialogData.example2"
            outlined
          ></v-textarea>
          <v-text-field
            label="Example Solution 1"
            type="number"
            v-model="dialogData.exampleSolution1"
            outlined
          ></v-text-field>
          <v-text-field
            label="Example Solution 2"
            type="number"
            v-model="dialogData.exampleSolution2"
            outlined
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn text @click="saveData">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isDev = process.env.NODE_ENV !== "production";

const drawer = ref(true);
const rail = ref(false);
const dialogVisible = ref(false);
const dialogDay = ref(null);
const dialogData = ref({
  input: "",
  example1: "",
  example2: "",
  exampleSolution1: "",
  exampleSolution2: "",
});

const completion_day_level = ref(null);
const examples = ref({});

async function getLeaderboardData() {
  let url =
    process.env.NODE_ENV === "production"
      ? `/advent-of-code-2024/leaderboard_member_3788958.json`
      : `/leaderboard_member_3788958.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch from ${url}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      completion_day_level.value = data.completion_day_level;
      return;
    } else if (contentType && contentType.includes("text/html")) {
      console.warn(`The server returned HTML instead of JSON for ${url}.`);
      const text = await response.text();
      console.debug("HTML content received:", text);
    } else {
      console.error(`Unexpected content type from ${url}: ${contentType}`);
    }
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
  }

  console.error("Failed to fetch leaderboard data from all sources.");
}

getLeaderboardData();

async function fetchExamples() {
  try {
    const response = await fetch("/examples.json");
    if (response.ok) {
      examples.value = await response.json();
    } else {
      console.error("Failed to load examples.json");
    }
  } catch (error) {
    console.error("Error fetching examples.json:", error);
  }
}

onMounted(() => {
  fetchExamples();
});

function formatTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function getStarColor(day, part) {
  let star = { color: "gray", time: "not yet" };
  if (
    completion_day_level.value &&
    completion_day_level.value[day] &&
    completion_day_level.value[day][part]
  ) {
    star = {
      color: "amber",
      time: formatTimestamp(completion_day_level.value[day][part].get_star_ts),
    };
  }
  return star;
}

async function openDialog(day) {
  dialogDay.value = day;
  dialogData.value = {
    input: "",
    example1: "",
    example2: "",
    exampleSolution1: "",
    exampleSolution2: "",
  };

  if (days.value.includes(day)) {
    try {
      await Promise.all([
        fetch(`/inputs/${day}.txt`).then((res) =>
          res
            .text()
            .then((text) => (text.includes("<!DOCTYPE html>") ? "" : text))
        ),
        fetch(`/inputs/${day}example.txt`).then((res) =>
          res
            .text()
            .then((text) =>
              text.includes("<!DOCTYPE html>")
                ? fetch(`/inputs/${day}example1.txt`).then((res2) =>
                    res2
                      .text()
                      .then((text2) =>
                        text2.includes("<!DOCTYPE html>") ? "" : text2
                      )
                  )
                : text
            )
        ),
        fetch(`/inputs/${day}example2.txt`).then((res) =>
          res
            .text()
            .then((text) => (text.includes("<!DOCTYPE html>") ? "" : text))
        ),
      ])
        .then(([input, example1, example2]) => {
          dialogData.value.input = input;
          dialogData.value.example1 = example1;
          dialogData.value.example2 = example2;
          dialogData.value.exampleSolution1 = examples.value[day]?.[0] || null;
          dialogData.value.exampleSolution2 = examples.value[day]?.[1] || null;
        })
        .then(() => {
          setTimeout(() => (dialogVisible.value = true), 10);
        });
    } catch (error) {
      console.error("Error fetching data for dialog:", error);
    }
  } else dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false;
  dialogDay.value = null;
}

function saveData() {
  if (!isDev) return;

  const day = dialogDay.value;
  if (!day) return;

  const data = dialogData.value;

  // Dane do zapisania w examples.json
  const newExamples = {
    [day]: [parseInt(data.exampleSolution1), parseInt(data.exampleSolution2)],
  };

  Promise.all([
    fetch(`http://localhost:3001/inputs/${day}.txt`, {
      method: "PUT",
      body: data.input,
    }),
    fetch(`http://localhost:3001/inputs/${day}example1.txt`, {
      method: "PUT",
      body: data.example1,
    }),
    fetch(`http://localhost:3001/inputs/${day}example2.txt`, {
      method: "PUT",
      body: data.example2,
    }),
    fetch(`http://localhost:3001/examples`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExamples),
    }),
    fetch(`http://localhost:3001/create-day/${day}`, {
      method: "POST",
    }),
  ])
    .then(() => {
      console.log("Files and examples.json updated successfully");
      examples.value[day] = [
        parseInt(data.exampleSolution1),
        parseInt(data.exampleSolution2),
      ];
    })
    .catch((error) =>
      console.error("Error saving files or examples.json:", error)
    );

  closeDialog();
}

const dayNumbers = Array.from({ length: 25 }, (_, i) => i + 1);
const dayFiles = import.meta.glob("@/components/days/*/solve.js");
const days = ref(
  Object.keys(dayFiles)
    .map((filePath) => {
      const day = filePath.split("/days/")[1]?.split("/")[0];
      return day ? parseInt(day) : null;
    })
    .filter(Boolean)
    .sort((a, b) => a - b)
);
</script>
