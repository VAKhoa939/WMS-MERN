import { Schema, model } from "mongoose";

const addressesSchema = new Schema({
  building_id: {
    type: String,
    unique: true,
    description: "Mã nhà kho duy nhất",
  },
  building_name: {
    type: String,
    unique: true,
    required: true,
    description: "Tên nhà kho",
  },
  maximum_capacity: {
    type: Number,
    min: 0,
    required: true,
    description: "Sức chứa tối đa của nhà kho",
  },
  responsible_user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    description: "ID người phụ trách nhà kho",
  },
});

addressesSchema.pre("save", function (next) {
  if (!this.building_id) {
    this.building_id = `WMS-${this.building_name}`;
  }
  next();
});
const Address = model("Address", addressesSchema);

export default Address;
