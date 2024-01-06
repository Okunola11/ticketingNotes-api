const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// @desc Login
// @route POST /auth
// @access Public
const handleLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and Password are required" });
  }
  const findUser = await User.findOne({ username }).exec();
  if (!findUser) {
    return res.status(401).json({ message: "Unauthorizeds" });
  }
  const match = await bcrypt.compare(password, findUser.password);
  if (match) {
    const roles = findUser.roles;
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": findUser.username,
          "roles": roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        "username": findUser.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    //Creating a http only secure cookie with the refreshToken
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // accessible only by a web server
      sameSite: "None", // cross site cookie
      secure: true, // http
      maxAge: 24 * 60 * 60 * 1000,
    });

    // send only access token containing username and roles
    res.json({ accessToken });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

// @desc Refresh
// @route POST /auth/refresh
// @access Public (because access token has expired)
const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const findUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!findUser) return res.status(401).json({ messsage: "Unauthorized" });

      const roles = findUser.roles;
      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "username": findUser.username,
            "roles": roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    })
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public (to make sure to clear cookies if exist)
const handleLogout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies) res.sendStatus(204);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookies cleared" });
};

module.exports = { handleLogin, handleRefreshToken, handleLogout };
