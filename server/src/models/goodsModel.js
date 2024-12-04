const mongoose = require("mongoose");
const historyItemSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    description: "Ngày kiểm kê",
  },
  real_count: {
    type: Number,
    min: 0,
    required: true,
    description: "Số lượng kiểm kê thực tế",
  },
  difference: {
    type: Number,
    min: 0,
    required: true,
    description: "Chênh lệch với sổ sách",
  },
});

const goodsSchema = new mongoose.Schema({
  goods_id: {
    type: String,
    unique: true,
    description: "Mã hàng hóa duy nhất",
  },
  goods_code: {
    type: String,
    required: true,
    description: "số hiệu hàng hóa",
  },
  goods_name: {
    type: String,
    required: true,
    description: "Tên hàng hóa",
  },
  specifications: {
    type: String,
    description: "Mô tả quy cách, đặc điểm của hàng hóa",
  },
  year_of_use: {
    type: Number,
    required: true, // Đảm bảo năm sử dụng được cung cấp
    description: "Năm bắt đầu sử dụng hàng hóa",
  },
  quantity: {
    type: Number,
    min: 0,
    required: true,
    description: "Số lượng",
  },
  unit_price: {
    type: Number,
    min: 0,
    required: true,
    description: "Đơn giá của từng hàng hóa",
  },
  origin_price: {
    type: Number,
    min: 0,
    required: true,
    description: "Nguyên giá tổng cho tất cả hàng hóa cùng loại",
  },
  real_count: {
    type: Number,
    min: 0,
    description: "Số lượng thực tế",
  },
  depreciation_rate: {
    type: Number,
    min: 0,
    max: 100,
    description: "Tỷ lệ hao mòn (%)",
  },
  remaining_value: {
    type: Number,
    min: 0,
    description: "Nguyên giá còn lại sau khấu hao",
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    description: "Địa chỉ (tòa nhà) của hàng hóa",
  },
  responsible_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    description: "Người phụ trách hàng hóa",
  },
  suggested_disposal: {
    type: String,
    description: "Thông tin về thanh lý",
  },
  note: {
    type: String,
    description: "Ghi chú thêm",
  },
  history: {
    type: [historyItemSchema],
    description: "Lịch sử kiểm kê và thay đổi",
  },
});

goodsSchema.pre("save", function (next) {
  if (this.isNew) {
    const year = this.year_of_use || new Date().getFullYear();
    const randomDigits = Math.floor(100 + Math.random() * 900);
    this.goods_id = `${year}-${randomDigits}`;
  }
  next();
});

const Goods = mongoose.model("Goods", goodsSchema);

module.exports = Goods;
