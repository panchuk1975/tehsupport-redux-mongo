import store from "./reduxStore";

let initialState = {};

//---------------------------------Consts---------------------------------//
const SET_CARS = "SET_CARS";
//-----------------------------Actions CREATORS---------------------------//
export const setCars = newCarsData => ({
  type: SET_CARS,
  newCarsData
});
//---------------------------------------------------------------------//
export const setCarsActionCreator = newCarsData => {
  if (newCarsData) {
    store.dispatch(setCars(newCarsData));
  }
};
//----------------------------------REDUCER------------------------------//
const carReducer = (state = initialState, action) => {
  switch (
    action.type // - change on switch
  ) {
    case SET_CARS:
      return {
        ...state,
        cars: action.newCarsData
      };
    default:
      return state;
  }
};

export default carReducer;
