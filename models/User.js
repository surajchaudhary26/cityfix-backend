const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: {
        validator: (val) => validator.isEmail(val),
        message: "Please provide a valid email"
    }
  },
  role: {
    type: String,
    enum: ["citizen", "worker", "admin"],
    default: "citizen"
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false // This prevents the password from being sent in API responses
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!
      validator: function(el) {
        return el === this.password;
      },
      message: "Passwords are not the same!"
    }
  }
});

userSchema.pre("save", async function() {
  // 1. Only run if password was modified
  if (!this.isModified("password")) return;
  // 2. Hash the password
  this.password = await bcrypt.hash(this.password, 12);
  // 3. Delete passwordConfirm field
  this.passwordConfirm = undefined;
});

// This method will be available on all user documents
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  // candidatePassword is what the user typed (plain text)
  // userPassword is the hash from the database
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model("User", userSchema);

module.exports = User;