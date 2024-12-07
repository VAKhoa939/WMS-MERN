import { Schema, model } from "mongoose";

const goodsSchema = new Schema({
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
    required: true,
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
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true,
    description: "Địa chỉ (tòa nhà) của hàng hóa",
  },
  responsible_user: {
    type: Schema.Types.ObjectId,
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
});

const Goods = model("Goods", goodsSchema);

export default Goods;
