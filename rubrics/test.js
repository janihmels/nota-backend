import CONST from "../Config/const.js";

// ----------------------------------------------
// ----------------------------------------------
export const testing = async (parameters, cb) => {
  let {
    input: { asin, from, upc },
  } = parameters;
  cb({error: "No UPC found"});
};