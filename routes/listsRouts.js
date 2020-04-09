const { Router } = require("express");
const Car = require("../models/Car");
const auth = require("../middleware/authMiddleware");
const router = Router();

//app/list/addList
router.post("/addList", auth, async (req, res) => {
  try {
    const { listNumber, carId } = req.body;
    const getAsk = await Car.updateOne(
      { _id: carId },
      { $push: { carLists: req.body } }
    );
    res
      .status(201)
      .json({
        message: `Лист №${listNumber} was created succsessfully!`,
        car: getAsk
      });
  } catch (e) {
    res.status(500).json({ message: "From addList :" + e.message });
  }
});

router.delete("/", auth, async (req, res) => {
    const { carId, listId } = req.body;
  try {
    const data = await Car.updateOne({ _id: carId },{ $pull: { carLists: {_id: listId}}});
    return await res.json(data); // return all owner links in json
  } catch (e) {
    res.status(500).json({ message: "Something wrong /listDelete, try again!" + e.message});
  }
});

router.put("/", async (req, res) => {
    const { carId, listId } = req.body;
  try {
    const car = await Car.updateOne(
        { _id: carId, carLists:{ $elemMatch:{_id: listId}}},
        {$set: { "carLists.$": req.body}});
    return await res.json(car);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
