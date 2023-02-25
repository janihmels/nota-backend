import { getCollection } from "../Aux/db.js";

// ----------------------------------------------
// ----------------------------------------------
export const get = async (parameters, cb) => {
  let {
    input: { userUid },
  } = parameters;

  console.log(userUid);
  let meter, plan;

  const resultUser = await getCollection("users").findOne({ userUid });
  if (resultUser) {
    meter = resultUser.meter;
    plan = resultUser.plan;
  }

  const feed = await getCollection("articles").find({ userUid }).toArray();
  if (feed) {
    console.log("Feed", feed);
  }

  cb({meter, plan, feed});
};
