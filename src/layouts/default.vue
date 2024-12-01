<template>
  <v-app>
    <v-navigation-drawer persistent app>
      <v-list>
        <v-list-item
          density="compact"
          v-for="day in dayNumbers"
          :key="day"
          :to="`/days/${day}`"
          :disabled="!days.includes(day)"
          link
        >
          <v-list-item-title class="d-flex justify-space-between">
            Day {{ day }}
            <span>
              <v-icon color="amber" icon="mdi-star" />
              <v-icon color="amber" icon="mdi-star" />
            </span>
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

const dayFiles = import.meta.glob("@/components/days/*/day.vue");
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
