export const store = {
  floors: 0,
  lifts: 0,
  liftLocations: [],
  liftStatus: [],
  pendingFloors: [],
};

export const initStore = ({ floors, lifts, liftLocations }) => {
  store.floors = floors;
  store.lifts = lifts;
  store.liftLocations = liftLocations;
  store.liftStatus = Array(lifts).fill("free");
  store.pendingFloors = [];
};

export const updateLiftLocations = ({ liftToMove, targetFloor }) => {
  store.liftLocations[liftToMove] = targetFloor;
};
