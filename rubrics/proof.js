import { Configuration, OpenAIApi } from "openai";
import CONST from "../Config/const.js";

const configuration = new Configuration({
  apiKey: CONST.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// ----------------------------------------------
// ----------------------------------------------
export const bullets = async (parameters, cb) => {
  let {
    input: { sentence },
  } = parameters;

  const preprompt = 'Summarize in bullets:\n\n';
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${preprompt}Correct this: "${sentence}"\n\nResponse:`,
    temperature: 0.5,
    max_tokens: 300,
    top_p: 0.3,
    frequency_penalty: 0.5,
    presence_penalty: 0,
  });
  console.log(response);
  cb({choices: response.data.choices});
};
