const express = require("express"); // connect exprecc
const config = require("config"); // connect config
const mongoose = require("mongoose"); // connect to mongoDB

const app = express(); // server - result of express

app.use(express.json({ extended: true }));
//-----------Routes for API requests---------------//
app.use("/api/auth", require('./routes/authRouts')); // connect middleware
app.use("/api/car", require('./routes/carsRouts'));
app.use("/api/list", require('./routes/listsRouts'));
app.use("/api/rout", require('./routes/routesRoutes'));
app.use("/api/liquids", require('./routes/liquidRouts'));
//--------------Authorization Rout-----------------//
const PORT = config.get("port") || 5000;

//-----------Acync connect to mongoDB--------------//
async function start() {
  // f() start connect to MDB
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  } catch (e) {
    console.log("Server error from app.js:", e.message);
    process.exit(1); // exit
  }
}

start(); // start connect to mongoDB
//----------------------------------------------------//

app.listen(PORT, () => console.log(`App has been  started ${PORT}`));
