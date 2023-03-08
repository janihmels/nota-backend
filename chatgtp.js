import { ChatGPTAPI } from "chatgpt";
import CONST from "./Config/const.js";

  const api = new ChatGPTAPI({
    apiKey: CONST.OPENAI_API_KEY,
  });

(async function example() {

  const res = await api.sendMessage("Summarize into simple and short bulletpoints: \n\n I. H.L.A Hart is unconvinced of John Austin’s Command Theory, which attempts to explain law adherence. Austin’s theory posits that we follow law because it is a command issued by a sovereign with sanctions for disobedience. He explains how following law becomes habit, and threat of punishment ensures these habits endure. Hart, however, is convinced Austin’s theory is underdeveloped. This paper argues that Hart is right to criticize Austin’s theory because his simplistic approach does not account for the internal aspects of law adherence, and that habit and fear of punishment are not the only motivators. Hart’s explanation of secondary rules, in particular the rule of recognition, highlights that Austin does not consider the internalized obligation to follow law.Section II provides more detail regarding Austin’s argument and Hart’s critique. Section III analyzes Hart’s argument, provides reasons for why I agree with his criticism and considers whether Austin can be defended against it. Section IV concludes by reiterating the central arguments of this paper.");
  console.log(res);
})();

