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
          <v-list-item-title value v-else>
            {{ day }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const drawer = ref(true);
const rail = ref(false);
const completion_day_level = ref(null);

async function getLeaderboardData() {
  const urls = [
    "/advent-of-code-2024/leaderboard_member_3788958.json",
    "/leaderboard_member_3788958.json",
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Failed to fetch from ${url}: ${response.statusText}`);
        continue;
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
        continue;
      } else {
        console.error(`Unexpected content type from ${url}: ${contentType}`);
      }
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
    }
  }

  console.error("Failed to fetch leaderboard data from all sources.");
}

getLeaderboardData();

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
  )
    star = {
      color: "amber",
      time: formatTimestamp(completion_day_level.value[day][part].get_star_ts),
    };
  return star;
}

const dayFiles = import.meta.glob("@/components/days/*/solve.js");
const dayNumbers = Array.from({ length: 25 }, (_, i) => i + 1);
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
