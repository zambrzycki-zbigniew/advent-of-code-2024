<template>
  <div
    class="map-container"
    ref="mapContainer"
    style="position: relative; width: 100%; height: 100%; overflow: hidden;"
  >
    <!-- Przycisk uruchamiania animacji -->
    <div style="position: absolute; top: 10px; left: 10px; z-index: 10;">
      <v-btn @click="startAnimation" :disabled="animationRunning">Start Animation</v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { Application, Container } from 'pixi.js';

const props = defineProps({
  mapX: {
    type: Number,
    required: true,
  },
  mapY: {
    type: Number,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  workerUrl: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['animationStarted', 'animationEnded']);
const mapContainer = ref(null);
let app, stageContainer, worker;

const animationRunning = ref(false);
const cellWidth = ref(0);
const cellHeight = ref(0);

function resizeApp() {
  if (!mapContainer.value) return;
  const containerRect = mapContainer.value.getBoundingClientRect();

  cellWidth.value = containerRect.width / props.mapX;
  cellHeight.value = containerRect.height / props.mapY;

  app.renderer.resize(containerRect.width, containerRect.height);
  drawItems();
}

function drawItems() {
  stageContainer.removeChildren();
  for (const item of props.items) {
    item.draw(stageContainer, item.x, item.y, cellWidth.value, cellHeight.value);
  }
}

function startAnimation() {
  if (!worker || animationRunning.value) return;
  worker.postMessage({ type: 'solvePart2', inputs: [props.mapX, props.mapY, props.items] });
  animationRunning.value = true;
  emit('animationStarted');
}

function onWorkerMessage(e) {
  const msg = e.data;

  if (msg.type === 'animationActions') {
    // Przetwarzanie akcji animacji
    for (const action of msg.actions) {
      const item = props.items.find((i) => i.id === action.id);
      if (item) {
        if (action.action === 'move_to') {
          item.x = action.args.x;
          item.y = action.args.y;
        }
        // Można dodać obsługę innych akcji
      }
    }
    drawItems();
  } else if (msg.type === 'solvePart2') {
    animationRunning.value = false;
    emit('animationEnded');
    console.log('Animation finished with result:', msg.finalResult);
  }
}

onMounted(async () => {
  app = new Application({
    backgroundColor: 0x1099bb,
    resizeTo: mapContainer.value,
  });

  mapContainer.value.appendChild(app.view);

  stageContainer = new Container();
  app.stage.addChild(stageContainer);

  worker = new Worker(props.workerUrl, { type: 'module' });
  worker.onmessage = onWorkerMessage;

  await nextTick();
  resizeApp();

  window.addEventListener('resize', resizeApp);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeApp);
  if (worker) worker.terminate();
  if (app) app.destroy(true, true);
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 400px; /* przykładowa wysokość */
  position: relative;
}
</style>
