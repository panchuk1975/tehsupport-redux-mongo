import store from "./reduxStore";

let initialState = {};

//---------------------------------Consts---------------------------------//
const SET_LIQUIDS = "SET_LIQUIDS";
//-----------------------------Actions CREATORS---------------------------//
export const setLiquids = newLiquidsData => ({
  type: SET_LIQUIDS,
  newLiquidsData
});
//---------------------------------------------------------------------//
export const setLiquidsActionCreator = newLiquidsData => {
  if (newLiquidsData) {
    store.dispatch(setLiquids(newLiquidsData));
  }
};
//----------------------------------REDUCER------------------------------//
const carReducer = (state = initialState, action) => {
  switch (
    action.type // - change on switch
  ) {
    case SET_LIQUIDS:
      return {
        ...state,
        liquids: action.newLiquidsData
      };
    default:
      return state;
  }
};

export default carReducer;
