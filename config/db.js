const mongoose = require("mongoose");
const validator = require("validator");
//const bcrypt = require("brcryptjs");
const jwt = require("jsonwebtoken");
const key_jwt = "eipv3-kGvBd684sdv9";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value))
        throw new Error({ error: "Invalid email" });
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 7
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 8);
  next();
});

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id, key_jwt });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error({ error: "Invalid login credentials" });

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) throw new Error({ error: "Invalid login credentials" });
  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = {
  url:
    "mongodb+srv://AdminEIPv3:kGvBd684sdv9cuEC@cluster0-bligr.gcp.mongodb.net/test?retryWrites=true&w=majority",
  User
};
