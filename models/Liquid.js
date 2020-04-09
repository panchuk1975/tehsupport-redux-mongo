const { Schema, model, Types } = require("mongoose"); 

const schema = new Schema({
      name: { type: String, unique: true, default: "" },
      balanceStart: { type: Number, default: null },
      received: { type: Number, default: null },
      expended: { type: Number, default: null },
      balanceFinish: { type: Number, default: null },
      density: { type: Number, default: null },
  owner: { type: Types.ObjectId, ref: "User" } 
});

module.exports = model("Liquid", schema);
