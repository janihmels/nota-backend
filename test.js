import fs from "fs";
import { Configuration, OpenAIApi } from "openai";
import CONST from "./Config/const.js";

const configuration = new Configuration({
  apiKey: CONST.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const crunch = async (file) => {
  const data = await fs.promises.readFile("./files/"+file, "utf-8");
  const paragraphs = data.split("\n").map(x=>x.trim()).filter(x => x!=="");
  let allBullets = "";
  for (const index in paragraphs) {
    console.log(index, paragraphs.length);
    if (index < 99) {
      const para = paragraphs[index];
      const prompt = "Summarize in bullets:\n\n"+para;
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0.2,
        max_tokens: 400,
        top_p: 0.3,
        frequency_penalty: 0.5,
        presence_penalty: 0,
      });
      const bullets = response.data.choices[0].text.split("•").map(x => x.trim()).filter(x=>x!=="");

      for(const bullet of bullets) {
        allBullets+=`-${bullet}\n`;
      }
      allBullets += "\n\n";
    }
  }
  fs.writeFileSync("./bullets/"+file, allBullets);
  
  const responseA = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Write a summary of these bullets:`+allBullets,
    temperature: 0.2,
    max_tokens: 500,
    top_p: 0.3,
    frequency_penalty: 0.5,
    presence_penalty: 0,
  });
  const summary = responseA.data.choices[0].text;
  fs.writeFileSync("./summaries/" + file, summary);

  /*const responseB = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:`tl;dr;\n\n` + summary,
    temperature: 0.2,
    max_tokens: 200,
    top_p: 0.3,
    frequency_penalty: 0.5,
    presence_penalty: 0,
  });
  const nutshell = responseB.data.choices[0].text;
  fs.writeFileSync("./nutshell/" + file, nutshell);*/

  let overall = "";
  //overall+=`OVERVIEW: \n${nutshell}\n\n------\n`;
  overall+=`SUMMARY: \n${summary}\n\n------\n`;
  overall+=`BULLETPOINTS: \n${allBullets}\n\n------\n`;

  fs.writeFileSync("./combination/" + file, overall);

};

(async () => {
  const files = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map( x => `EN_${x}.txt`);
  for(const file of files) {
    console.log("Processing file:", file);
    await crunch(file);
  }
})();
