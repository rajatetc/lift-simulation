import { store, initStore } from "./store.js";
import { DIRECTIONS } from "./constants.js";

const submitButton = document.getElementById("submit-button");
const lobby = document.getElementById("lobby");
const formContainer = document.getElementById("form-container");

submitButton.addEventListener("click", (e) => {
  e.preventDefault();

  const floorsValue = parseInt(document.getElementById("floors").value);
  const liftsValue = parseInt(document.getElementById("lifts").value);

  initStore({
    floors: floorsValue,
    lifts: liftsValue,
    liftLocations: Array(liftsValue).fill(0),
  });

  console.log(store);

  if (
    isNaN(store.floors) ||
    isNaN(store.lifts) ||
    store.floors > 10 ||
    store.lifts > 5
  ) {
    alert("Please enter a valid number of floors and lifts");
  } else {
    makeLobby();
  }
});

const moveLift = ({ targetFloor, direction }) => {
  let liftToMoveBasedOnDirection = -1;
  let nearestLiftDistanceBasedOnDirection = Infinity;
  let nearestLiftOverall = -1;
  let nearestLiftDistanceOverall = Infinity;

  for (let i = 0; i < store.liftLocations.length; i++) {
    const distanceFromTargetFloor = Math.abs(
      store.liftLocations[i] - targetFloor
    );
    const isLiftAboveTarget = store.liftLocations[i] > targetFloor;
    const isLiftBelowTarget = store.liftLocations[i] < targetFloor;

    if (
      (direction === DIRECTIONS.DOWN && isLiftAboveTarget) ||
      (direction === DIRECTIONS.UP && isLiftBelowTarget)
    ) {
      if (distanceFromTargetFloor < nearestLiftDistanceBasedOnDirection) {
        nearestLiftDistanceBasedOnDirection = distanceFromTargetFloor;
        liftToMoveBasedOnDirection = i;
      }
    }

    if (distanceFromTargetFloor < nearestLiftDistanceOverall) {
      nearestLiftDistanceOverall = distanceFromTargetFloor;
      nearestLiftOverall = i;
    }
  }

  const liftToMove =
    liftToMoveBasedOnDirection !== -1
      ? liftToMoveBasedOnDirection
      : nearestLiftOverall;

  store.liftLocations[liftToMove] = targetFloor;
  // todo: maybe optimize - whole lobby is getting created on every list
  makeLobby();
};

const makeLobby = () => {
  formContainer.classList.replace("visible", "hidden");
  lobby.classList.replace("hidden", "visible");

  lobby.innerHTML = "";

  //  todo: why are scrollbars appearing? fix later
  for (let i = 0; i < store.floors; i++) {
    /*** FLOORS ***/
    const floorContainer = document.createElement("div");
    floorContainer.classList.add("floor-container");
    floorContainer.id = `floor-${i + 1}`;
    lobby.appendChild(floorContainer);
    const floor = document.createElement("hr");
    floor.classList.add("floor");
    floorContainer.appendChild(floor);
    const floorLabel = document.createElement("span");
    floorLabel.classList.add("floor-label");
    floorLabel.innerText = floorContainer.id;
    floorContainer.appendChild(floorLabel);

    /*** BUTTONS ***/
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("lift-buttons-container");
    floorContainer.appendChild(buttonsContainer);
    const upButton = document.createElement("button");
    upButton.classList.add("lift-button");
    upButton.innerText = "▲";
    buttonsContainer.appendChild(upButton);
    const downButton = document.createElement("button");
    downButton.classList.add("lift-button");
    downButton.innerText = "▼";
    buttonsContainer.appendChild(downButton);

    /*** LIFTS ***/
    const liftsContainer = document.createElement("div");
    liftsContainer.classList.add("lifts-container");
    floorContainer.appendChild(liftsContainer);
    for (let j = 0; j < store.lifts; j++) {
      const lift = document.createElement("div");
      lift.classList.add("lift");
      if (store.liftLocations[j] === i) {
        lift.id = `lift-${j + 1}`;
        lift.innerHTML = `<div class='left-door'></div><div class='right-door'></div>`;
      }
      liftsContainer.appendChild(lift);
    }
    upButton.addEventListener("click", () => {
      moveLift({ targetFloor: i, direction: DIRECTIONS.UP });
    });

    downButton.addEventListener("click", () => {
      moveLift({ targetFloor: i, direction: DIRECTIONS.DOWN });
    });
  }
};

// todo: toggle - remove later when all is developed
// makeLobby();