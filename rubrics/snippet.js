import md5 from "md5";
import { ChatGPTAPI } from "chatgpt";
// ----------------------------------------------
import CONST from "../Config/const.js";
import { getCollection } from "../Aux/db.js";
// ----------------------------------------------
const api = new ChatGPTAPI({
  apiKey: CONST.OPENAI_API_KEY,
});

// ----------------------------------------------
// ----------------------------------------------
export const reply = async (parameters, cb) => {
  let {
    input: { snippet, mode, uri, userid, xcoordinate, ycoordinate, pageTitle },
  } = parameters;
  let reply = "",
    increment = 0;

  const prompts = {
    define: (snippet) => `Define: "${snippet}"`,
    explain: (snippet) => `Explain in simple terms: "${snippet}"`,
    bullets: (snippet) => `Summarize in short bullet points: "${snippet}"`,
  };

  console.log("Snippet analysis", mode, uri, userid);
  if (prompts.hasOwnProperty(mode)) {
    const prompt = prompts[mode](snippet);
    const res = await api.sendMessage(prompt);

    if (res.text) {
      reply = res.text;
      increment = res.detail.usage.total_tokens;
    }
  }


  const collection = getCollection("pages");
  const hash = md5(uri);  
  await collection.updateOne(
    { userid, hash },
    {
      $set: { uri, pageTitle },
      $push: {
        snippets: {
          added: Date.now(),
          mode,
          snippet,
          reply,
          xcoordinate, 
          ycoordinate,
          increment,
        },
      },
    },
    { upsert: true }
  );
  await incMeter(userid, increment);
  cb({ reply });
  //cb( {reply: "Moinsen Reply"});
};

// ----------------------------------------------
// ----------------------------------------------
const incMeter = async (userUid, inc) => {
  console.log("Incrementing meter", userUid, inc);
  const collection = getCollection("users");
  await collection.updateOne({ userUid }, { $inc: { meter: inc } });
};
