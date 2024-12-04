const mongoose = require("mongoose");

const addressesSchema = new mongoose.Schema({
  building_id: {
    type: String,
    unique: true,
    description: "Mã nhà kho duy nhất",
  },
  building_name: {
    type: String,
    required: true,
    description: "Tên nhà kho",
  },
  goods_list: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      description: "Danh sách ID của hàng hóa trong nhà kho",
    },
  ],
  responsible_user: {
    type: mongoose.Schema.Types.ObjectId,
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
const Address = mongoose.model("Address", addressesSchema);

module.exports = Address;
