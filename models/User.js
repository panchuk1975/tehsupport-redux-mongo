const { Schema, model, Types } = require("mongoose");

//-----Create new schema from constructor schema class------//
const schema = new Schema({
  email: { type: String, required: true, unique: true, default: "" },
  password: { type: String, required: true, default: "" },
  firstName: { type: String, default: "" },
  secondName: { type: String, default: "" },
  mobilePhon: { type: String, default: "" },
  address: { type: String, default: "" },
  company: { type: String, default: "" },
  cars: [{ type: Types.ObjectId, ref: "Car" }],
  liquids: [{ type: Types.ObjectId, ref: "Liquid" }]
});

//--Export rethult function model from file and give Name--//
module.exports = model("User", schema); // schema is work obj
