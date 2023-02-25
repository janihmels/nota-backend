import { getCollection } from "../Aux/db.js";
import md5 from "md5";

// ----------------------------------------------
// ----------------------------------------------
export const test = async (parameters, cb) => {
    let {
      input: { text },
    } = parameters; 

    const collection = getCollection("test");
    const result = await collection.insertOne({ text });
    cb();
}

// ----------------------------------------------
// ----------------------------------------------
export const getArticle = async (parameters, cb) => {
    let {
      input: { uri }
    } = parameters; 
    const hash = md5(uri);
    const collection = getCollection("articles");
    const result = await collection.findOne({ hash });
    cb(result);
}
// ----------------------------------------------
// ----------------------------------------------
export const setArticle = async (parameters, cb) => {
    const {
      input: { paragraphsString, uri },
    } = parameters; 

    const paragraphs = JSON.parse(paragraphsString);
    const hash = md5(uri);

    const collection = getCollection("articles");
    await collection.updateOne(
      { hash },
      {
        $set: {
          uri,
          paragraphs,
        },
      },
      { upsert: true }
    );
    cb();
}