import { Configuration, OpenAIApi } from "openai";
import CONST from "../Config/const.js";

const configuration = new Configuration({
  apiKey: CONST.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// ----------------------------------------------
// ----------------------------------------------
const prompts = {
  "is-paragraph": (text) =>
    `Is this a) a citation, b) a heading, c) a paragraph?\n${text}`,
  explain: (text) => `Explain to a teenager: \n"${text}"`,
  headline: (text) => `Find a headline for this:\n\n${text}`,
  bullets: (text) => `Summarize into short and simple bullets:\n\n${text}`,

};

const getResponse = async (paragraph, mode, temperature, max_tokens = 3000) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompts[mode](paragraph),
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
export const headlines = async (parameters, cb) => {
  let {
    input: { paragraph },
  } = parameters;

  const responseCategory = await getResponse(paragraph, "is-paragraph", 0, 35);
  if (!responseCategory.data) {
    cb();
    return;
  }
  const category = responseCategory.data.choices[0].text.trim();
  let headline = "Not a paragraph";
  if (category.toUpperCase().includes("PARAGRAPH")) {
    const responseHeadline = await getResponse(paragraph, "headline", 0.5, 300);
    if (responseHeadline.data) {
      headline = responseHeadline.data.choices[0].text
        .trim()
        .replace(/^Exploring the /i, "")
        .trim();
    }
  }
  cb({ category, headline });
};

// ----------------------------------------------
// ----------------------------------------------
export const paragraph = async (parameters, cb) => {
  let {
    input: { paragraph, parindex },
  } = parameters;

  let explain = "",
    bulletpoints = "";
  const responseBullets = await getResponse(paragraph, "bullets", 0.5, 2500);
  if (responseBullets.data) {
    bulletpoints = responseBullets.data.choices[0].text
      .trim()
      .split("\n")
      .map((x) => x.trim().replace(/^\-/g, "").replace(/^•/g, "").trim());
  }

  const responseExplain = await getResponse(paragraph, "explain", 0.5, 1000);
  if (responseExplain.data) {
    explain = responseExplain.data.choices[0].text.trim();
  }
  cb({ bulletpoints, explain, parindex });
};

export const get = async (parameters, cb) => {
  let {
    input: { text, mode },
  } = parameters;
  const response = await getResponse(text, mode, 0.5, 1000);

}