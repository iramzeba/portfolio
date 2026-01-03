const jwt = require("jsonwebtoken");
const RefreshToken = require("./refreshToken.model");
const {signAccessToken,signRefreshToken} = require('../../utils/jwt')

module.exports.refreshTokenMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Read refresh token from httpOnly cookie
   
    const refreshToken = req.cookies?.refreshToken;
     console.log(refreshToken,'refreshToken')
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    // 2️⃣ Verify refresh JWT
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
console.log(payload)
    if (payload.type !== "refresh") {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // 3️⃣ Check DB
    const tokenDoc = await RefreshToken.findOne({
      userId: payload.userId,
      token: refreshToken
    });
console.log(tokenDoc,'tokenDoc')
    if (!tokenDoc) {
      return res.status(403).json({ message: "Refresh token revoked" });
    }

    // 4️⃣ Issue new access token
    const newAccessToken = signAccessToken({
      userId: payload.userId,
      orgId: payload.orgId,
     type: "access" 
    });

    // 5️⃣ Respond here (middleware ends request)
    return res.json({ accessToken: newAccessToken });

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Refresh token expired" });
    }
    return res.status(403).json({ message: "Invalid refresh tokennn" });
  }
};

