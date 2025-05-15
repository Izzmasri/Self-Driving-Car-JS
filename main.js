const carCanvas = document.getElementById("carCanvas");
// to make the road
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 1;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.2);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
];

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function setControlMode(mode) {
  // Clear all cars and create one with the selected control type
  const controlType = mode === "AI" ? "AI" : "KEYS";

  // Reset the cars array
  cars.length = 0;

  cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, controlType));

  bestCar = cars[0];

  // If using AI and there's a saved brain, load it
  if (controlType === "AI" && localStorage.getItem("bestBrain")) {
    bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
  }
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  // to make the road
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  // Save the current canvas state (transformation, styles, etc.)
  carCtx.save();
  // Translate (move) the canvas to simulate camera following the car
  // Moves everything vertically so the car stays around 70% from the top of the canvas
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  // Draw the road (after applying the translation)
  road.draw(carCtx);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.2;
  // Draw the car (after applying the translation)
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  // Restore the canvas state to what it was before ctx.save(), removing the translation
  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  // Call the animate function again on the next frame (creates an animation loop)
  requestAnimationFrame(animate);
}
