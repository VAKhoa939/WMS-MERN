import { Schema, model } from "mongoose";

const usersSchema = new Schema(
  {
    user_id: {
      type: String,
      ref: "User",
      description: "ID người dùng",
    },
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: 6,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: 10,
      maxLength: 50,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    phone_number: {
      type: String,
      trim: true,
      default: "",
      description: "Số điện thoại người dùng",
    },
    admin: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      description: "Chức vụ của người dùng",
    },
    is_active: {
      type: Boolean,
      default: true,
      description: "Trạng thái hoạt động của người dùng",
    },
  },
  { timestamps: true }
);

function generateUserId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `NT-${randomNum}`;
}

usersSchema.pre("save", function (next) {
  if (!this.user_id) {
    this.user_id = generateUserId();
  }
  next();
});

const User = model("User", usersSchema);

export default User;
