import { Request, Response } from "express";
import { Configuration, OpenAIApi } from "openai";
import { parseAnswer, parseBoolean } from "../utils/parse";

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const systemMessage: string =
	'Your will be provided a task along with 2 code snippets, your task will be to say "CODE_CORRECT" if the second code snippet does the same thing as the first one, or "CODE_WRONG" if it does not or its wrong. Also add a description explaining why its wrong or correct. Check the code carefully!';

/**
 * Currently the openai api cannot be tested due to api limit exceeded
 */
class CodeController {
	async compare(req: Request, res: Response) {
		const { task, firstCode, secondCode } = req.body;

		const userMessage = `Task: ${task}first code: ${secondCode} \n second code: ${firstCode}`;
		console.log("openai request")

		try {
			const response = await openai.createChatCompletion({
				model: "gpt-3.5-turbo",
				messages: [
					{
						role: "system",
						content: systemMessage,
					},
					{
						role: "user",
						content: userMessage,
					},
				],
				temperature: 0.1,
				max_tokens: 256,
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0,
			});
			/**Have to parse the reponse to a boolean value */
			const {isCorrect,description} = parseAnswer(response.data.choices[0].message?.content!)
			console.log(isCorrect, description);
            res.status(200).json({isCorrect,description})
		} catch (error: any) {
			if(error.response && error.response.status === 429){
				res.status(429).json({error: "OpenAI API rate limit exceeded."})
			}

			else{
				res.status(500).json({ error: "Internal Server Error" });
			}
		}
	}
}

export default CodeController;
