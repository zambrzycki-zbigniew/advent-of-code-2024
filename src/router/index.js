import { createRouter, createWebHashHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';
import { routes as autoRoutes } from 'vue-router/auto-routes';
import GenericDayComponent from '@/pages/advent-of-code/day.vue';
import ArcCalculatorComponent from '@/pages/advent-of-code/day.vue';

const arcCalculatorRoute = {
  path: `/minecraft/arcCalculator`,
  component: ArcCalculatorComponent,
  name: "MinecraftArcCalculator",
};

const dayFiles = import.meta.glob('@/components/days/*/solve.js');

let examplesData = {};
async function fetchExamples() {
  try {

    let url = process.env.NODE_ENV === "production" ? `/advent-of-code-2024/examples.json` : `/examples.json`
    const response = await fetch(url);
    try {
      examplesData = await response.json()
    } catch (err) {
      console.error(err)
    }
  } catch (error) {
    console.error('Error fetching examples.json:', error);
  }
}

const dayRoutes = Object.keys(dayFiles).map((filePath) => {
  const day = filePath.split('/days/')[1]?.split('/')[0];
  if (day) {
    const dayNumber = parseInt(day, 10);
    return [
      {
        path: `/days/${dayNumber}`,
        component: GenericDayComponent,
        name: `Day${dayNumber}`,
        props: (route) => ({
          day: dayNumber,
          examples: examplesData[dayNumber] || [],
        }),
        beforeEnter: async (to, from, next) => {
          await fetchExamples();
          next();
        },
      },
      {
        path: `/days/${dayNumber}/part/1`,
        component: GenericDayComponent,
        name: `Day${dayNumber}Part1`,
        props: (route) => ({
          day: dayNumber,
          part: 1,
          examples: examplesData[dayNumber] || [],
        }),
        beforeEnter: async (to, from, next) => {
          await fetchExamples();
          next();
        },
      },
      {
        path: `/days/${dayNumber}/part/2`,
        component: GenericDayComponent,
        name: `Day${dayNumber}Part2`,
        props: (route) => ({
          day: dayNumber,
          part: 2,
          examples: examplesData[dayNumber] || [],
        }),
        beforeEnter: async (to, from, next) => {
          await fetchExamples();
          next();
        },
      },
    ];
  }
  return [null];
}).flat().filter(Boolean);

const routes = setupLayouts([
  {
    path: '/',
    redirect: '/days/1',
  },
  ...autoRoutes,
  ...dayRoutes,
  arcCalculatorRoute,
]);

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
