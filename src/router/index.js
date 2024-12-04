import { createRouter, createWebHashHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';
import { routes as autoRoutes } from 'vue-router/auto-routes';
import GenericDayComponent from '@/pages/advent-of-code/day.vue'
import ArcCalculatorComponent from '@/pages/advent-of-code/day.vue'

const arcCalculatorRoute = {
  path: `/minecraft/arcCalculator`,
  component: ArcCalculatorComponent,
  name: "MinecraftArcCalculator"
}

const dayFiles = import.meta.glob('@/components/days/*/solve.js');
const dayRoutes = Object.keys(dayFiles).map((filePath) => {
  const day = filePath.split('/days/')[1]?.split('/')[0];
  console.log(day)
  if (day) {
    const dayNumber = parseInt(day, 10)
    return [
      {
        path: `/days/${dayNumber}`,
        component: GenericDayComponent,
        name: `Day${dayNumber}`,
        props: { day: dayNumber },
      },
      {
        path: `/days/${dayNumber}/part/1`,
        component: GenericDayComponent,
        name: `Day${dayNumber}Part1`,
        props: { day: dayNumber, part: 1 },
      },
      {
        path: `/days/${dayNumber}/part/2`,
        component: GenericDayComponent,
        name: `Day${dayNumber}Part2`,
        props: { day: dayNumber, part: 2 },
      },
    ]
  }
  return [null];
}).flat().filter(Boolean);

const routes = setupLayouts([...autoRoutes, ...dayRoutes, arcCalculatorRoute]);

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
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
