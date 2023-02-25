import md5 from "md5";
import pkg from "openai";
const { OpenAIApi, Configuration } = pkg;
// ----------------------------------------------
import CONST from "../Config/const.js";
import { getCollection } from "../Aux/db.js";
// ----------------------------------------------
const configuration = new Configuration({
  apiKey: CONST.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.5,
      max_tokens: 300,
      top_p: 0.3,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    if (response.data && response.data.choices.length) {
      reply = response.data.choices[0].text.trim();
      increment = response.data.usage.total_tokens;
    }
  }


  /*const uri = "Moinsen Freunde";
  const pageTitle = "Moinsen Headline";
  const reply = "Moinsen Reply";
  const userid = "Moinsen User";*/

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
};

// ----------------------------------------------
// ----------------------------------------------
const incMeter = async (userUid, inc) => {
  console.log("Incrementing meter", userUid, inc);
  const collection = getCollection("users");
  await collection.updateOne({ userUid }, { $inc: { meter: inc } });
};
