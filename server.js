const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;
const path = require("path");

// middleware to process json data
app.use(express.json());

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
