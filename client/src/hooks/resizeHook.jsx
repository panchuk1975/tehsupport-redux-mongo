export const ClassSize = (innerWidth, screenWidth) => {
  let cardClass = "col s3 grey lighten-1";

  if (innerWidth < 640 || screenWidth < 640) {
    cardClass = "col s6 grey lighten-1";
  } else if (innerWidth < 950 || window.screenWidth < 950) {
    cardClass = "col s4 grey lighten-1";
  } else if (innerWidth < 1100 || screenWidth < 1100) {
    cardClass = "col s3 grey lighten-1";
  }
  return cardClass;
};

export const inputClassSize = (innerWidth, screenWidth) => {
  let cardClass = "col s2  yellow-input center-align";

  if (innerWidth < 540 || screenWidth < 540) {
    cardClass = "col s5 yellow-input center-align";
  } else if (innerWidth <= 850 || screenWidth <= 840) {
    cardClass = "col s4 yellow-input center-align";
  } else if (innerWidth < 1200 || screenWidth <1200) {
    cardClass = "col s3 yellow-input center-align";
  }
  return cardClass;
};

export const inputRightClassSize = (innerWidth, screenWidth) => {
    let cardClass = "col s2 yellow-input";
  
    if (innerWidth < 540 || screenWidth < 540) {
      cardClass = "col s6  yellow-input";
    } else if (innerWidth <= 650 || screenWidth <= 640) {
      cardClass = "col s6 offset-1 yellow-input";
    } else if (innerWidth < 900 || screenWidth <900) {
      cardClass = "col s4 yellow-input";
    } else if (innerWidth < 1200 || screenWidth <1200) {
        cardClass = "col s3 yellow-input";
      }
    return cardClass;
  };
  