import { getCollection } from "../Aux/db.js";
import md5 from "md5";

// page:
// - hash
// - uri
// - pageTitle
// - paragraphs
// - summary
// - documentType

// ----------------------------------------------
// ----------------------------------------------
export const load = async (parameters, cb) => {
    let {
      input: { uri, userid }
    } = parameters; 
    const hash = md5(uri);
    const collection = getCollection("pages");
    console.log("Loading page", hash, userid);
    const result = await collection.findOne({ hash, userid });
    cb(result);
}

// ----------------------------------------------
// ----------------------------------------------
export const storeParagraphs = async (parameters, cb) => {
    const {
      input: { paragraphsString, pageTitle, uri, userid },
    } = parameters; 

    const paragraphs = JSON.parse(paragraphsString);
    const hash = md5(uri);

    const collection = getCollection("pages");
    await collection.updateOne(
      { hash, userid },
      {
        $set: {
          uri, pageTitle,
          paragraphs,
        },
      },
      { upsert: true }
    );
    cb();
}

// ----------------------------------------------
// ----------------------------------------------
export const updateParagraph = async (parameters, cb) => {
  const {
    input: { content, mode, parindex, uri, userid },
  } = parameters; 

  const hash = md5(uri);
  const collection = getCollection("pages");
  const key = `paragraphs.${parindex}.${mode}`;
  const set = {};
  set[key] = content,

  await collection.updateOne(
    { hash, userid },
    { $set: set }
  );
  cb();
}

// ----------------------------------------------
// ----------------------------------------------
export const addSummary = async (parameters, cb) => {
  const {
    input: { uri, userid, summary },
  } = parameters; 

  const hash = md5(uri);
  const collection = getCollection("pages");

  await collection.updateOne(
    { hash, userid },
    { $set: { summary } }
  );
  cb();
}
