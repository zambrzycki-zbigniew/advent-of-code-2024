<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <h2>Arc and Squares Visualization</h2>
        <v-text-field
          v-model="a"
          label="Chord Length (a)"
          type="number"
          @input="calculateSquares"
        />
        <v-text-field
          v-model="b"
          label="Arc Height (b)"
          type="number"
          @input="calculateSquares"
        />
      </v-col>
      <v-col cols="4">
        <h2>Shape Strategies</h2>
        <div v-if="shapeStrategies">
          <v-row
            v-for="shape in Object.keys(shapeStrategies).filter(
              (shape) => shape !== 'Empty'
            )"
            :key="shape"
            no-gutters
          >
            <v-col cols="4" class="d-flex align-center">
              <span>{{ shape }}</span>
            </v-col>
            <v-col cols="8">
              <v-select
                density="compact"
                v-model="shapeStrategies[shape]"
                :items="strategyOptions"
                label="Strategy"
                @update:modelValue="calculateSquares"
              />
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col cols="5">
        <h2>Display</h2>
        <v-list-item>
          <v-list-item-title>Helper lines</v-list-item-title>
          <v-list-item-action>
            <v-btn-toggle
              v-model="showHelperLines"
              label="Show helper lines"
              @click="calculateSquares"
              ><v-btn>Hide</v-btn><v-btn>Show</v-btn></v-btn-toggle
            >
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Support blocks</v-list-item-title>
          <v-list-item-action>
            <v-btn-toggle
              v-model="addSupportBlocks"
              label="Add support blocks"
              @click="calculateSquares"
              ><v-btn>Remove</v-btn><v-btn>Add</v-btn></v-btn-toggle
            >
          </v-list-item-action>
        </v-list-item>
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <h2>Canvas Visualization:</h2>
    <canvas
      ref="canvas"
      width="600"
      height="400"
      style="background-color: black"
    ></canvas>
  </v-container>
</template>


<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const a = ref(15);
    const b = ref(4);
    const result = ref([]);
    const canvas = ref(null);
    const showHelperLines = ref(true);
    const addSupportBlocks = ref(false);

    const strategyOptions = ["Keep", "Remove"];
    const shapeStrategies = ref({
      "Full block": "Keep",
      Stairs: "Keep",
      Slab: "Keep",
      "Vertical slab": "Keep",
      "Quater block": "Keep",
      Empty: "Keep",
    });

    const detectShape = (square) => {
      const corners = square.subSquares;
      const pointsAbove = corners.filter((sub) => sub.pointsInsideCircle > 25);
      const pointsAboveThreshold = pointsAbove.length;
      if (pointsAboveThreshold === 4) {
        square.shape = "Full block";
      } else if (pointsAboveThreshold === 3) {
        square.shape = "Stairs";
      } else if (
        pointsAboveThreshold === 2 &&
        pointsAbove[0].y === pointsAbove[1].y
      ) {
        square.shape = "Slab";
      } else if (
        pointsAboveThreshold === 2 &&
        pointsAbove[0].x === pointsAbove[1].x
      ) {
        square.shape = "Vertical slab";
      } else if (pointsAboveThreshold === 1) {
        square.shape = "Quater block";
      } else {
        square.shape = "Empty";
      }
    };

    const handleShape = (square, squares) => {
      const strategy = shapeStrategies.value[square.shape];

      if (strategy === "Keep") {
        return;
      } else if (strategy === "Remove") {
        square.subSquares.forEach((sub) => {
          sub.pointsInsideCircle = 0;
        });
        square.shape = "Empty";
      }
    };

    const addSupport = (square, squares) => {
      let support = squares.find(
        (sqr) => sqr.x === square.x && sqr.y === square.y - 1
      );
      if (!support) {
        const chordLength = parseFloat(a.value);
        const height = parseFloat(b.value);

        const r = (height ** 2 + chordLength ** 2 / 4) / (2 * height);
        const cy = r;

        const chordY = 2 * cy - height - 1;
        const chordStartX = -chordLength / 2;
        const chordEndX = chordLength / 2;
        let x = square.x;
        let y = square.y - 1;
        support = {
          x,
          y,
          subSquares: [],
          shape: "Full block",
        };

        const corners = [
          { x: x, y: y },
          { x: x + 1, y: y },
          { x: x, y: y + 1 },
          { x: x + 1, y: y + 1 },
        ];
        support.corners = corners;

        const intersects =
          corners.every((corner) => corner.y >= chordY) &&
          corners.every((corner) => corner.x >= chordStartX) &&
          corners.every((corner) => corner.x <= chordEndX);
        if (intersects) {
          for (let dx = 0; dx < 2; dx++) {
            for (let dy = 0; dy < 2; dy++) {
              const subSquareX = x + dx * 0.5;
              const subSquareY = y + dy * 0.5;

              const subSquareCorners = [
                { x: subSquareX, y: subSquareY },
                { x: subSquareX + 0.5, y: subSquareY },
                { x: subSquareX, y: subSquareY + 0.5 },
                { x: subSquareX + 0.5, y: subSquareY + 0.5 },
              ];
              let pointsInsideCircle = 100;
              support.subSquares.push({
                x: subSquareX,
                y: subSquareY,
                corners: subSquareCorners,
                pointsInsideCircle,
              });
            }
          }
          squares.push(support);
        }
      } else {
        if (support.shape === "Empty") {
          support.shape === "Full block";
          support.subSquares.forEach(
            (subSquare) => (subSquare.pointsInsideCircle = 100)
          );
        }
      }
    };

    const resetResult = () => {
      result.value = [];
      const ctx = canvas.value.getContext("2d");
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    };

    const draw = (
      squares,
      cx,
      cy,
      r,
      chordStartX,
      chordEndX,
      chordY,
      b,
      scale
    ) => {
      const ctx = canvas.value.getContext("2d");
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

      squares.forEach((square) => {
        square.subSquares.forEach((sub) => {
          if (sub.pointsInsideCircle > 25) {
            ctx.fillStyle = "gray";
            ctx.fillRect(
              Math.round(canvas.value.width / 2 + sub.x * scale),
              Math.round(
                canvas.value.height -
                  (sub.y + 0.5) * scale +
                  (1.95 * r - b) * scale
              ),
              Math.ceil(scale / 2),
              Math.ceil(scale / 2)
            );
          }
        });

        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          Math.round(canvas.value.width / 2 + square.x * scale),
          Math.round(
            canvas.value.height -
              (square.y + 1) * scale +
              (1.95 * r - b) * scale
          ),
          Math.ceil(scale),
          Math.ceil(scale)
        );
      });
      if (showHelperLines.value) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
          canvas.value.width / 2,
          canvas.value.height - cy * scale + (1.95 * r - b) * scale,
          r * scale,
          Math.PI,
          0
        );
        ctx.stroke();
      }

      if (showHelperLines.value) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(
          canvas.value.width / 2 + chordStartX * scale,
          canvas.value.height - chordY * scale + (1.95 * r - b) * scale
        );
        ctx.lineTo(
          canvas.value.width / 2 + chordEndX * scale,
          canvas.value.height - chordY * scale + (1.95 * r - b) * scale
        );
        ctx.stroke();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(
          canvas.value.width / 2,
          canvas.value.height - chordY * scale + (1.95 * r - b) * scale
        );
        ctx.lineTo(
          canvas.value.width / 2,
          canvas.value.height - (chordY + b) * scale + (1.95 * r - b) * scale
        );
        ctx.stroke();
      }
    };

    const calculateSquares = () => {
      canvas.value.width = 600;
      if (!a.value || !b.value || a.value <= 0 || b.value <= 0) {
        console.log("Please provide valid values for a and b.");
        return;
      }

      const chordLength = parseFloat(a.value);
      const height = parseFloat(b.value);

      const r = (height ** 2 + chordLength ** 2 / 4) / (2 * height);
      const cx = 0;
      const cy = r;

      const chordY = 2 * cy - height;
      const chordStartX = -chordLength / 2;
      const chordEndX = chordLength / 2;

      const startX = chordStartX - 1;
      const endX = chordEndX + 1;
      const startY = chordY;
      const endY = 2 * cy;
      const squares = [];

      for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
          const square = {
            x,
            y,
            subSquares: [],
          };

          const corners = [
            { x: x, y: y },
            { x: x + 1, y: y },
            { x: x, y: y + 1 },
            { x: x + 1, y: y + 1 },
          ];
          square.corners = corners;

          const intersects =
            corners.every((corner) => corner.y >= chordY) &&
            corners.every((corner) => corner.x >= chordStartX) &&
            corners.every((corner) => corner.x <= chordEndX) &&
            corners.some((corner) => {
              return (
                Math.pow(corner.x - cx, 2) + Math.pow(corner.y - cy, 2) <=
                Math.pow(r, 2)
              );
            }) &&
            corners.some((corner) => {
              return (
                Math.pow(corner.x - cx, 2) + Math.pow(corner.y - cy, 2) >=
                Math.pow(r, 2)
              );
            });

          if (!intersects) continue;
          corners.every((corner) => corner.y >= chordY) &&
            corners.some((corner) => {
              return (
                Math.pow(corner.x - cx, 2) + Math.pow(corner.y - cy, 2) <=
                Math.pow(r, 2)
              );
            });
          for (let dx = 0; dx < 2; dx++) {
            for (let dy = 0; dy < 2; dy++) {
              const subSquareX = x + dx * 0.5;
              const subSquareY = y + dy * 0.5;

              const subSquareCorners = [
                { x: subSquareX, y: subSquareY },
                { x: subSquareX + 0.5, y: subSquareY },
                { x: subSquareX, y: subSquareY + 0.5 },
                { x: subSquareX + 0.5, y: subSquareY + 0.5 },
              ];
              let pointsInsideCircle = 0;
              for (let i = 0; i <= 10; i++) {
                const px = subSquareX + i / 20;
                for (let j = 0; j <= 10; j++) {
                  const py = subSquareY + j / 20;
                  if ((px - cx) ** 2 + (py - cy) ** 2 <= r ** 2) {
                    pointsInsideCircle++;
                  }
                }
              }
              square.subSquares.push({
                x: subSquareX,
                y: subSquareY,
                corners: subSquareCorners,
                pointsInsideCircle,
              });
            }
          }

          squares.push(square);
        }
      }

      result.value = squares;
      result.value.forEach((square) => {
        detectShape(square);
      });

      if (addSupportBlocks.value) {
        [...result.value].forEach((square) => {
          addSupport(square, result.value);
        });
      }

      [...result.value].forEach((square) => {
        handleShape(square, result.value);
      });

      let scale = (20 * canvas.value.width) / (1.2 * chordLength * 20);
      if (scale < 15) {
        canvas.value.width = canvas.value.width * (15 / scale);
        scale = 15;
      }
      // if(r * scale > canvas.value.width/2) scale = scale * (canvas.value.width/2)/(r * scale)
      console.log(scale, r, canvas.value.width);
      draw(squares, cx, cy, r, chordStartX, chordEndX, chordY, height, scale);
    };

    onMounted(() => {
      const ctx = canvas.value.getContext("2d");
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
      calculateSquares();
    });

    return {
      a,
      b,
      result,
      canvas,
      resetResult,
      calculateSquares,
      shapeStrategies,
      strategyOptions,
      showHelperLines,
      addSupportBlocks,
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

canvas {
  border: 1px solid #fff;
}
</style>
