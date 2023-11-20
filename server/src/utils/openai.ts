import { OpenAI } from "openai";
import { parseAnswer } from "./parse";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const runAssistantEvaluation = async (
	task: string,
	correctCode: string,
	userCode: string
) => {
	if (!task || !correctCode || !userCode) {
		return;
	}
	const content = `Task: \n ${task} \n\n Correct code: \n ${correctCode} \n\n User code: \n ${userCode}`;

	const assistant = await openai.beta.assistants.retrieve(process.env.OPENAI_ASSISTANT_ID || "");
	const thread = await openai.beta.threads.create();

	const message = await openai.beta.threads.messages.create(thread.id, {
		role: "user",
		content: content,
	});
	let run = await openai.beta.threads.runs.create(thread.id, {
		assistant_id: assistant.id,
		model: "gpt-3.5-turbo-16k",
	});
	run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
	console.log(run.status);

	const checkStatus = async () => {
		run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
		console.log(run.status);
		if (run.status !== "completed") {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			await checkStatus(); // Recursive call to check status again
		}
	};
	// Will be checking the status until its completed and only then list the messages
	await checkStatus();

	const messages = await openai.beta.threads.messages.list(thread.id);
	// @ts-expect-error
	console.log(messages.data[0].content[0].text.value);
	// @ts-expect-error
    const parsedAnswers = parseAnswer(messages.data[0].content[0].text.value)
	return parsedAnswers;
};
