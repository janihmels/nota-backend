import { getCollection } from "../Aux/db.js";
import { Long } from "mongodb";

// ----------------------------------------------
// ----------------------------------------------
export const signup = async (parameters, cb) => {
  let {
    input: { userEmail, userUid },
  } = parameters;
  const collection = getCollection("users");
  const now = Long.fromNumber(Date.now());
  await collection.insertOne({
    userEmail,
    userUid,
    added: now,
    lastUsage: now,
    meter: 0,
    plan: "free",
  });  
  cb();
};

// ----------------------------------------------
// ----------------------------------------------
export const signin = async (parameters, cb) => {
  let {
    input: { userUid },
  } = parameters;
  const collection = getCollection("users");
  const result = await collection.findOne({ userUid });
  cb(result);
};