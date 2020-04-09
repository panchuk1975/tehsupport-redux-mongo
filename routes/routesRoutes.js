const { Router } = require("express");
const Car = require("../models/Car");
const auth = require("../middleware/authMiddleware");
const router = Router();

//api/rout/addRoute
router.post("/addRoute", auth, async (req, res) => {
  try {
    const getAsk = await Car.updateOne(
      {
        _id: req.body.carId,
        carLists: { $elemMatch: { _id: req.body.listId } }
      },
      { $push: { "carLists.$.listRoutes": req.body } }
    );
    res.status(201).json({
      message: `Route №${req.body.routNumber} was created succsessfully!`,
      car: getAsk
    });
  } catch (e) {
    res.status(500).json({ message: "From addList :" + e.message });
  }
});

module.exports = router;
