const express = require("express");
const cors = require("cors");
const mediaRouter = require("./routes/media");
const typesRouter = require("./routes/types");

const app = express();
app.use(cors());

app.use(express.json());
//Path for health check
app.get("/health", (req, res) => {
    res.send("OK");
});

//Routes to be used for fetching media information
app.use("/api/media", mediaRouter);
//Routes to be used for fetching type information
app.use("/api/types", typesRouter);

module.exports = app;
