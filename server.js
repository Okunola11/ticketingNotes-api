const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const PORT = process.env.PORT || 3500;

// middleware to log requests
app.use(logger);

// middlewear to handle credential check before cors
app.use(credentials);

// cross origin resource sharing
app.use(cors(corsOptions));

// middleware to process json data
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// middleware to access static files
app.use("/", express.static(path.join(__dirname, "public")));

//routes
app.use("/", require("./routes/root"));

// any page or request not found. app.all() accepts and applies to all http methods at once
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type(txt).send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
