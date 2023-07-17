export const store = {
  floors: 0,
  lifts: 0,
  liftLocations: [],
};

export const initStore = ({ floors, lifts, liftLocations }) => {
  store.floors = floors;
  store.lifts = lifts;
  store.liftLocations = liftLocations;
};

export const updateLiftLocations = ({ liftToMove, targetFloor }) => {
  store.liftLocations[liftToMove] = targetFloor;
};
