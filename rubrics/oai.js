import { Configuration, OpenAIApi } from "openai";
import { getCollection } from "../Aux/db.js";
import CONST from "../Config/const.js";
// ----------------------------------------------
const configuration = new Configuration({
  apiKey: CONST.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const prompts = {
  summary: (text) => `Shorten and summarize: \n"${text}"`,
  bulletpoints: (text) => `Summarize into short and simple bullets:\n\n${text}`,
  summarize: (text) => `Summarize into a single paragraph: \n\n"${text}"`,
};


// ----------------------------------------------
// ----------------------------------------------
const getResponse = async (prompt, temperature, max_tokens = 3000) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature,
    max_tokens,
    top_p: 0,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return response;
};

// ----------------------------------------------
// ----------------------------------------------
export const query = async (parameters, cb) => {
  let reply, increment = 0;
  const {
    input: { text, mode, userid },
  } = parameters;
  const prompt = prompts[mode](text);
  const response = await getResponse(prompt, 0.5, 1000);
  if (response.data) {
    reply = response.data.choices[0].text
      .trim()
    increment = response.data.usage.total_tokens;
  }
  incMeter(userid, increment);
  cb({ reply });
}
// ----------------------------------------------
// ----------------------------------------------
export const summarize = async (parameters, cb) => {
  let reply, increment = 0;
  const {
    input: { text, userid },
  } = parameters;

  const prompt = prompts["summarize"](text);
  const response = await getResponse(prompt, 0.3, 3000);
  if (response.data) {
    reply = response.data.choices[0].text
      .trim()
    increment = response.data.usage.total_tokens;
  }
  incMeter(userid, increment);
  cb({ reply });
}

const incMeter = async (userUid, inc) => {
  console.log("Incrementing meter", userUid, inc);
  const collection = getCollection("users");
  await collection.updateOne({ userUid }, { $inc: { meter: inc } });
};
