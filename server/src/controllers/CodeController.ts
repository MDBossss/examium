import { Request, Response } from "express";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const systemMessage: string =
	'Your will be provided with 2 code snippets, your task will be to say "true" if the 2 code snippets have the same function/achieve the same result, or "false" if they do not.';

/**
 * Currently the openai api cannot be tested due to api limit exceeded
 */
class CodeController {
	async compare(req: Request, res: Response) {
		const { firstCode, secondCode } = req.body;

		const userMessage = `first code: ${firstCode} \n second code: ${secondCode}`;

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
				temperature: 1,
				max_tokens: 256,
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0,
			});
			/**Have to parse the reponse to a boolean value */
            res.status(200).json(response)
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
