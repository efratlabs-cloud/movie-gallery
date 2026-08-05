const mongoose = require("mongoose");
//trim = מוחק רווחים מההתחלה ומהסוף
const usersSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      match: /\S+@\S+\.\S+/,
    },
    password: { type: String, select: false },
    fullName: { type: String, default: "", trim: true },
    avatar: { type: String, default: "" },
    favoriteGenres: { type: [String], default: [] },
    watchList: { type: [String], default: [] },
    birthDate: { type: Date, default: "" },

  },
  { timestamps: true },
  );


module.exports = mongoose.model("User", usersSchema);