import { store, initStore, updateLiftLocations } from "./store.js";
import {
  DIRECTIONS,
  LIFT_ANIMATION_TIME,
  LIFT_TO_FLOOR_TIME,
} from "./constants.js";

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

  if (
    isNaN(store.floors) ||
    isNaN(store.lifts) ||
    store.floors > 10 ||
    store.lifts > 6
  ) {
    alert("Please enter a valid number of floors and lifts");
  } else if (
    (store.lifts > 3 && window.innerWidth <= 400) ||
    (store.floors > 7 && window.innerHeight < 650)
  ) {
    alert("Please add less than 3 lifts & 7 floors to avoid scrolling");
  } else {
    makeLobby();
  }
});

const checkPendingFloors = () => {
  if (store.pendingFloors.length > 0) {
    for (let i = 0; i < store.liftLocations.length; i++) {
      if (store.liftStatus[i] === "free") {
        const nextFloor = store.pendingFloors.shift();
        moveLift(nextFloor);
        break;
      }
    }
  }
};

const openAndCloseDoors = (liftToOpenEl) => {
  const leftDoor = liftToOpenEl.querySelector(".left-door");
  const rightDoor = liftToOpenEl.querySelector(".right-door");
  if (leftDoor && rightDoor) {
    leftDoor.classList.add("open-left-door");
    rightDoor.classList.add("open-right-door");

    setTimeout(() => {
      leftDoor.classList.remove("open-left-door");
      rightDoor.classList.remove("open-right-door");
    }, LIFT_ANIMATION_TIME);
  }
};

const moveLift = (targetFloor) => {
  store.pendingFloors.push(targetFloor);

  let liftToMove = -1;

  for (let i = 0; i < store.liftLocations.length; i++) {
    if (store.liftStatus[i] === "free") {
      liftToMove = i;
      break;
    }
  }

  if (liftToMove !== -1) {
    targetFloor = store.pendingFloors.shift();
    store.liftStatus[liftToMove] = "busy";

    const timeToTargetFloor =
      Math.abs(store.liftLocations[liftToMove] - targetFloor) *
      LIFT_TO_FLOOR_TIME;

    const liftToOpenEl = document.getElementById(`lift-${liftToMove + 1}`);
    if (liftToOpenEl) {
      openAndCloseDoors(liftToOpenEl);

      setTimeout(() => {
        liftToOpenEl.style.transition = `bottom ${timeToTargetFloor}ms linear`;
        liftToOpenEl.style.bottom = `${targetFloor * 100}px`;

        setTimeout(() => {
          openAndCloseDoors(liftToOpenEl);
          store.liftStatus[liftToMove] = "free";
          updateLiftLocations({
            liftToMove: liftToMove,
            targetFloor: targetFloor,
          });
          checkPendingFloors();
        }, timeToTargetFloor);
      }, LIFT_ANIMATION_TIME * 2 + 100);
    }
  }
};

const makeLobby = ({ liftToOpen = null, targetFloor = null } = {}) => {
  formContainer.classList.replace("visible", "hidden");
  lobby.classList.replace("hidden", "visible");

  lobby.innerHTML = "";

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
      if (store.liftLocations[j] === i) {
        const lift = document.createElement("div");
        lift.classList.add("lift");
        lift.style.bottom = `${store.liftLocations[j] * 90}px`;
        lift.id = `lift-${j + 1}`;
        lift.innerHTML = `<div class='left-door'></div><div class='right-door'></div>`;
        liftsContainer.appendChild(lift);

        setTimeout(() => {
          if (liftToOpen === j && targetFloor === i) {
            openAndCloseDoors(lift);
          }
        }, 0);
      }
    }
    upButton.addEventListener("click", () => {
      moveLift(i);
    });

    downButton.addEventListener("click", () => {
      moveLift(i);
    });
  }

  if (store.floors > 6) {
    window.scrollTo(0, document.body.scrollHeight);
  }
};
