const { Router } = require("express");
const Liquid = require("../models/Liquid");
const auth = require("../middleware/authMiddleware");
const router = Router();

//---------------------------api/liquid/create---------------------------//
router.post("/", auth, async (req, res) => {
  try {
    // get baseUrl from config
    const { name } = req.body; 
    const existing = await Liquid.findOne({ name }); // is exist in db
    if (existing) {
      //if link exist send it in respond
      return res.json({ message: "Liquid is exists!" });
    } // if link  not exist let create link "to"
    const liquid = new Liquid({
      // create new link object with all parameters
      ...req.body,
      owner: req.user.userId
    });
    const getAsk = await liquid.save();
    res.status(201).json({
      message: `New liquid was created succsessfully!`,
      getAsk
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
//---------------------------api/liquid/update---------------------------//
router.put("/", auth, async (req, res) => {
  try {
    // get baseUrl from config
    const {
      name,
      balanceStart,
      received,
      expended,
      balanceFinish,
      cost,
      density
    } = req.body; // get from request body 
    const liquid = new Liquid({
      // create new object with all parameters
      name,
      balanceStart,
      received,
      expended,
      balanceFinish,
      cost,
      density,
      owner: req.user.userId
    });
    const getAsk = await Liquid.updateOne(
      { _id: req.body._id },
      {
        $set: {
          name: liquid.name,
          balanceStart: liquid.balanceStart,
          received: liquid.received,
          expended: liquid.expended,
          balanceFinish: liquid.balanceFinish,
          cost: liquid.cost,
          density: liquid.density,
          owner: req.user.userId
        }
      }
    );
    res.status(201).json({
      message: `Liquid was updated succsessfully!`,
      getAsk
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

//-------------------------------api/liquid/------------------------------//
router.get("/", auth, async (req, res) => {
  try {
    // find all owner links to id
    const listLiquids = await Liquid.find({ owner: req.user.userId });
    return await res.json(listLiquids); // return all owner links in json
  } catch (e) {
    res.status(500).json({ message: "Something wrong /cars, try again!" });
  }
});
//-------------------------------api/liquid//:id----------------------------//
router.delete("/:id", auth, async (req, res) => {
  try {
    const liquid = await Liquid.deleteOne({ _id: req.params.id });
    return await res.json({ message: "Liquid was deleted succsessfully!" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
