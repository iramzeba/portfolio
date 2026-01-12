const authService = require("./auth.service");
const RefreshToken = require('./refreshToken.model');
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {signAccessToken,signRefreshToken} = require('../../utils/jwt')
exports.register = async (req, res) => {
  try {
  
    const user = await authService.register(req.body.email, req.body.password,req.body.role);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
     const user = await User.findOne({ email:req.body.email });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare( req.body.password,user.password);
  if (!match) throw new Error("Invalid credentials");

    // const token = await authService.login(req.body.email, req.body.password);
    // res.json({ token });
     const accessToken = signAccessToken({
    userId: user._id,
    orgId: user.orgId,
    type: "access" ,
    role:user.role 
  });

  const refreshToken = signRefreshToken({
    userId: user._id,
    orgId: user.orgId,
     type: "refresh" ,
     role:user.role 
  });

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken,userId:user._id,role:user.role });

  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.logout = async(req,res)=>{
  console.log(req.cookie)
  const token = req.cookies?.refreshToken;
  await RefreshToken.deleteOne({token})
  res.clearCookie("refreshToken")
  res.json({message: "Logged out"})
}

exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  const stored = await RefreshToken.findOne({ token });
  if (!stored) return res.status(403).json({ message: "Invalid refresh token" });

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return res.status(403).json({ message: "Expired refresh token" });
  }

  const newAccessToken = signAccessToken({
    userId: payload.userId,
  });

  res.json({ accessToken: newAccessToken });
};