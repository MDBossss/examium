import { Request, Response } from "express";
import { runAssistantEvaluation } from "../utils/openai";

class CodeController {
	async evaluateCode(req: Request, res: Response) {
		try{
			const { task, correctCode, userCode } = req.body;

			const data = await runAssistantEvaluation(task,correctCode,userCode);

			res.status(200).json(data)
		} catch (error: any) {
			if (error.response && error.response.status === 429) {
				res.status(429).json({ error: "OpenAI API rate limit exceeded." });
			} else {
				res.status(500).json({ error: "Internal Server Error" });
			}
		}
}
}

export default CodeController;
