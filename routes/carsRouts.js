const { Router } = require("express");
const Car = require("../models/Car");
const auth = require("../middleware/authMiddleware");
const router = Router();

//---------------------------api/car/create---------------------------//
router.post("/create", auth, async (req, res) => {
  try {// get baseUrl from config
    const {
      governmentCarNumber
    } = req.body; // get from request body  were from our link
    const existing = await Car.findOne({ governmentCarNumber }); // is exist in db
    if (existing) {//if link exist send it in respond
      return res.json({ message: "Car is exists!" });
    } // if link  not exist let create link "to"
    const car = new Car({// create new link object with all parameters
     ...req.body,
      owner: req.user.userId
    });
    const getAsk = await car.save();
    res.status(201).json({
      message: `New car was created succsessfully!`,
      getAsk
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
    console.log(e.message);
  }
});

//---------------------------api/car/update---------------------------//
router.put("/update", auth, async (req, res) => {
  try {
    // grt baseUrl from config
    const {
      typeOfCar,
      governmentCarNumber,
      factoryCarNumber,
      dateOfRegistration,
      carEngineNumber,
      carPassportNumber,
      specialCarEquipment,
      specialCarEquipmentNumber,
      carOwnerName,
      dateOfCarProduction,
      operatingGroup,
      category,
      carIndicatorFirst,
      carIndicatorLast,
      totalCarMileage,
      carTimeFirst,
      carTimeLast,
      carTimeTotal,
      fuelActiveСonsumption,
      fuelPassiveСonsumption,
      carLiquids,
      carLists
    } = req.body; // get from request body  were from our link
    const car = new Car({
      // create new link object with all parameters
      typeOfCar,
      governmentCarNumber,
      factoryCarNumber,
      dateOfRegistration,
      carEngineNumber,
      carPassportNumber,
      specialCarEquipment,
      specialCarEquipmentNumber,
      carOwnerName,
      dateOfCarProduction,
      operatingGroup,
      category,
      carIndicatorFirst,
      carIndicatorLast,
      totalCarMileage,
      carTimeFirst,
      carTimeLast,
      carTimeTotal,
      fuelActiveСonsumption,
      fuelPassiveСonsumption,
      carLiquids,
      carLists,
      owner: req.user.userId
    });
    const getAsk = await Car.updateOne(
      { _id: req.body._id },
      {
        $set: {
          typeOfCar: car.typeOfCar,
          governmentCarNumber: car.governmentCarNumber,
          factoryCarNumber: car.factoryCarNumber,
          dateOfRegistration: car.dateOfRegistration,
          carEngineNumber: car.carEngineNumber,
          carPassportNumber: car.carPassportNumber,
          specialCarEquipment: car.specialCarEquipment,
          specialCarEquipmentNumber: car.specialCarEquipmentNumber,
          carOwnerName: car.carOwnerName,
          dateOfCarProduction: car.dateOfCarProduction,
          operatingGroup: car.operatingGroup,
          category: car.category,
          carIndicatorFirst: car.carIndicatorFirst,
          carIndicatorLast: car.carIndicatorLast,
          totalCarMileage: car.totalCarMileage,
          carTimeFirst: car.carTimeFirst,
          carTimeLast: car.carTimeLast,
          carTimeTotal: car.carTimeTotal,
          fuelActiveСonsumption: car.fuelActiveСonsumption,
          fuelPassiveСonsumption: car.fuelPassiveСonsumption,
        }
      }
    );
    res.status(201).json({
      message: `${car.typeOfCar}: ${car.governmentCarNumber} was updated succsessfully!`,
      getAsk
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
    console.log(e.message);
  }
});

//-------------------------------api/car/------------------------------//
router.get("/", auth, async (req, res) => {
  try {
    // find all owner links to id
    const cars = await Car.find({ owner: req.user.userId });
    return await res.json(cars); // return all owner links in json
  } catch (e) {
    res.status(500).json({ message: "Something wrong /cars, try again!" });
  }
});
//-------------------------------api/car/:id----------------------------//
router.delete("/:id", auth, async (req, res) => {
    try {
      const car = await Car.deleteOne({ _id: req.params.id });
      return await res.json({ message: "Car was deleted succsessfully!" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });

// router.get("/:id", auth, async (req, res) => {
//   try {
//     const car = await Car.findById(req.params.id);
//     return await res.json(car);
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// });

module.exports = router;
