import { ChatGPTAPI } from "chatgpt";
import { getCollection } from "../Aux/db.js";
import CONST from "../Config/const.js";
// ----------------------------------------------
const api = new ChatGPTAPI({
  apiKey: CONST.OPENAI_API_KEY,
});
// ----------------------------------------------
const prompts = {
  summary: (text) => `Shorten and summarize: \n"${text}"`,
  bulletpoints: (text) => `Summarize into short and simple bullets:\n\n${text}`,
  summarize: (text) => `Summarize into a single paragraph: \n\n"${text}"`,
};



// ----------------------------------------------
// ----------------------------------------------
export const query = async (parameters, cb) => {
  let reply, increment = 0;
  const {
    input: { text, mode, userid },
  } = parameters;
  const prompt = prompts[mode](text);
  const res = await api.sendMessage(prompt);
  if (res.text) {
    reply = res.text.trim();
    increment = res.detail.usage.total_tokens;
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
  const res = await api.sendMessage(prompt);

  if (res.text) {
    reply = res.text.trim();
    increment = res.detail.usage.total_tokens;
  }

  incMeter(userid, increment);
  cb({ reply });
}

// ----------------------------------------------
// ----------------------------------------------
const incMeter = async (userUid, inc) => {
  console.log("Incrementing meter", userUid, inc);
  const collection = getCollection("users");
  await collection.updateOne({ userUid }, { $inc: { meter: inc } });
};
