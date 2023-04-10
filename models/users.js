const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const uuid = require("uuid").v4;

const userSubscription = {
  STARTER: "starter",
  PRO: "pro",
  BUSINESS: "business",
};

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
      select: false,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: Object.values(userSubscription),
      default: userSubscription.STARTER,
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
  },
  { versionKey: false, timestamp: true }
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash("md5").update(this.email).digest("hex");
    this.verificationToken = `${uuid()}`;
    this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=retro`;
  }

  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.checkPassword = (candidate, hash) =>
  bcrypt.compare(candidate, hash);

userSchema.methods.setToken = function (token) {
  return (this.token = token);
};

userSchema.methods.setVerify = function (verify) {
  this.verify = verify;
  this.verificationToken = null;
};

const User = mongoose.model("User", userSchema, "users");

module.exports = { User, userSubscription };
