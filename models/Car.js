const { Schema, model, Types } = require("mongoose"); // - get items from mongoose

const schema = new Schema({
  // - conditions for fields
  typeOfCar: { type: String, required: true, default: "" },
  governmentCarNumber: {
    type: String,
    required: true,
    unique: true,
    default: ""
  },
  factoryCarNumber: { type: String, default: "" },
  dateOfRegistration: { type: String, default: "" },
  carEngineNumber: { type: String, default: "" },
  carPassportNumber: { type: String, default: "" },
  specialCarEquipment: { type: String, default: "" },
  specialCarEquipmentNumber: { type: String, default: "" },
  carOwnerName: { type: String, default: "" },
  dateOfCarProduction: { type: String, default: "" },
  operatingGroup: { type: String, default: "" },
  category: { type: String, default: "" },
  carIndicatorFirst: { type: Number, default: 0 },
  carIndicatorLast: { type: Number, default: 0 }, // speedometr
  totalCarMileage: { type: Number, default: 0 },
  carTimeFirst: { type: Number, default: 0 },
  carTimeLast: { type: Number, default: 0 }, // timer
  carTimeTotal: { type: Number, default: 0 },
  fuelActiveСonsumption: { type: Number, required: true, default: 0 },
  fuelPassiveСonsumption: { type: Number, default: 0 },
  carLists: [
    {
      listNumber: { type: String, required: true, default: "" },
      listDate: { type: String, default: "", required: true },
      driverName: { type: String, default: "" },
      listRouteFrom: { type: String, default: "" },
      listRouteTo: { type: String, default: "" },
      seniorName: { type: String, default: "" },
      departure: { type: String, default: "" },
      arrival: { type: String, default: "" },
      indicatorListStart: { type: Number, default: 0 },
      indicatorListFinish: { type: Number, default: 0 },
      totalListMileage: { type: Number, default: 0 },
      timeListFirst: { type: Number, default: 0 },
      timeListLast: { type: Number, default: 0 },
      timeListTotal: { type: Number, default: 0 },
      season: { type: Number, default: 1, required: true },
      listRoutes: [
        {
          routNumber: {
            type: String,
            required: true,
            default: ""
          },
          routDate: { type: String, required: true, default: "" }, // Date.now - default reference method
          routeFrom: { type: String, default: "" },
          routeTo: { type: String, default: "" },
          routDeparture: { type: String, default: "" },
          routArrival: { type: String, required: true, default: "" },
          routeWithCargo: { type: Number, default: 0 },
          routeWithoutCargo: { type: Number, default: 0 },
          routeWithTrailer: { type: Number, default: 0 },
          routeInaTow: { type: Number, default: 0 },
          routeTotal: { type: Number, default: 0 },
          timeOnSite: { type: Number, default: 0 },
          timeInaMotion: { type: Number, default: 0 },
          routTotalTime: { type: Number, required: true, default: 0 },
          trailerWeight: { type: Number, default: 0 },
          cargoWeight: { type: Number, default: 0 },
          cargoName: { type: String, default: "" },
          typeOfPavement: { type: Number, required: true, default: 1 },
          routLiquids: [
            {
              name: { type: String, required: true, default: "" },
              balanceStart: { type: Number, required: true, default: 0 },
              received: { type: Number, required: true, default: 0 },
              expended: { type: Number, required: true, default: 0 },
              balanceFinish: { type: Number, default: 0 },
              cost: { type: Number, required: true, default: 0 },
              density: { type: Number, default: 0 }
            }
          ]
        }
      ]
    }
  ], // for User model
  owner: { type: Types.ObjectId, ref: "User" } // for User model
});

module.exports = model("Car", schema);

module.exports.models = {
  connection: "mongodb",
  migrate: "safe"
};
