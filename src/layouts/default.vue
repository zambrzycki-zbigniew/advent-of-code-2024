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
              <v-icon color="amber" icon="mdi-star" />
              <v-icon color="amber" icon="mdi-star" />
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
