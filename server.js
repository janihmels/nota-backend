import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// -----------------------------------
import { mongoConnect } from "./Aux/db.js";

// -----------------------------------
// -----------------------------------
const app = express();
app.use(bodyParser.json({ limit: "2000mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(cors());

mongoConnect();

// -----------------------------------
// -----------------------------------
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

// -----------------------------------
// -----------------------------------
app.get("/", (req, res) => {
  res.send("Hey There");
});

// -----------------------------------
// -----------------------------------
app.post("/:rubric/:call", async (req, res) => {
  const rubric = req.params.rubric;
  const call = req.params.call;
  console.log("Request received", rubric, call);
  const input = req.body;
  const dynamodule = await import(`./rubrics/${rubric}.js`);
  try {
    dynamodule[call]({ input }, (result) => {
      res.json(result);
    });
  } catch (err) {
    console.log("Err is", err);
  }
});
