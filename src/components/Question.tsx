import { XMarkIcon, Bars4Icon } from "@heroicons/react/24/solid";
import { Textarea } from "./ui/textarea";
import { useRef, useEffect, useState } from "react";
import Answer from "./Answer";
import { Button } from "./ui/button";

const Question = () => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [answers, setAnswers] = useState<string[]>([""]);
    const [correctAnswers,setCorrectAnswers] = useState<string[]>([]);

	const handleAnswerChange = (text: string, index: number) => {
		if (index === answers.length - 1) {
			setAnswers((prevArray) => [...prevArray, ""]);
		}

		setAnswers((prevArray) => {
			return prevArray.map((element, i) => (i === index ? text : element));
		});
	};

	const handleAnswerDelete = (index: number, answer: string) => {
		setAnswers((prevArray) => prevArray.filter((_, i) => i !== index));
        setCorrectAnswers((prevArray) => prevArray.filter((a) => a !== answer));
	};

    const handleAddAnswer = () => {
        setAnswers((prevArray) => [...prevArray,""]);
    }

    const handleToggleCorrectAnswer = (answer:string) => {
        let found = false;
        correctAnswers.map((a) => {
            if(a === answer){
                found = true;
                return setCorrectAnswers((prevArray) => prevArray.filter((a) => a !== answer))
            }
        })
        if(!found){
            setCorrectAnswers((prevArray) => [...prevArray,answer])
        }
    }

    console.log(correctAnswers)

	useEffect(() => {
		const textarea = textareaRef.current;

		if (textarea) {
			const adjustTextareaHeight = () => {
				textarea.style.height = "auto";
				textarea.style.height = `${textarea.scrollHeight}px`;
			};

			textarea.addEventListener("input", adjustTextareaHeight);
			return () => {
				textarea.removeEventListener("input", adjustTextareaHeight);
			};
		}
	}, []);

	return (
		<div className=" bg-slate-200 w-full p-5">
			<div className="flex flex-col gap-5 max-w-4xl mx-auto pt-10 pb-10">
				<div className="flex justify-between">
					<h1 className="flex gap-3 items-center text-2xl font-bold">
						<Bars4Icon className="text-slate-400 h-7 w-7" /> Question 1
					</h1>
					<XMarkIcon className="text-slate-400 h-7 w-7 cursor-pointer hover:text-red-600" />
				</div>
				<Textarea
					ref={textareaRef}
					className="bg-primary text-lg p-5 overflow-hidden resize-none min-h-[50px]"
					placeholder="Insert question..."
				/>
				<div className="flex flex-col gap-2">
					{answers.map((answer, index) => {
						let label = String.fromCharCode(65 + index);
						return (
							<Answer
								key={index}
								index={index}
								label={label}
								answer={answer}
								onChange={handleAnswerChange}
								onDelete={handleAnswerDelete}
                                toggleCorrect={handleToggleCorrectAnswer}
							/>
						);
					})}
				</div>
				<div className="flex justify-end">
					<Button
						variant="ghost"
						className="text-blue-500 font-bold text-lg hover:bg-slate-100 hover:text-blue-500"
						onClick={handleAddAnswer}
					>
						Add answer +
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Question;
