export function parseBoolean(value: string) {
	if (value.toLowerCase() === "true") return true;
	else if (value.toLowerCase() === "false") return false;
}

export function parseAnswer(value:string): {isCorrect: boolean,description:string | null}{
	let isCorrect: boolean = false;
	let description: string | null = null;

	if(value.includes("CODE_CORRECT")){
		isCorrect = true;
		description = value.replace("CODE_CORRECT","");
	}
	else if(value.includes("CODE_WRONG")){
		isCorrect = false;
		description = value.replace("CODE_WRONG","");
	}


	return {isCorrect,description}
}
