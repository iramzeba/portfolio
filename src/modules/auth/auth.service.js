const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const RefreshToken = require('./refreshToken.model');
const {signAccessToken,signRefreshToken} = require('../../utils/jwt')


exports.register = async (email, password,role) => {
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashed,role });
  await user.save();
  return user;
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECERET, { expiresIn: "19h" });



  return accessToken;
};

