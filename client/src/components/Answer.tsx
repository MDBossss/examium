import { Textarea } from "./ui/textarea";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { AnswerType } from "../types/models";

interface Props{
    onChange: (text:string,index:number) => void,
    onDelete: (index:number, answer:string) => void,
    toggleCorrect: (index:number) => void,
    label: string,
    index:number,
    answer: AnswerType
}

const Answer = ({onChange,onDelete,toggleCorrect,label,index,answer}:Props) => {

	const handleCorrect = () => {
        toggleCorrect(index);
    };

	return (
		<div className="flex items-center">
			<h2 className="text-xl text-zinc-400 p-5">{label}</h2>
			<div className="relative flex w-full">
				<Textarea
					className="bg-primary text-lg p-5 pr-14 overflow-hidden resize-none"
					onChange={(e) => onChange(e.target.value,index)}
                    placeholder="Answer..."
                    value={answer.answer}
				/>
				<CheckIcon
					className={`${answer.isCorrect ? "bg-green-500 text-white" : "text-green-600 bg-green-100"} absolute right-2 top-2 z-10 h-8 w-8 p-2 rounded-sm  hover:bg-green-500 hover:text-white cursor-pointer`}
					onClick={handleCorrect}
				/>
				<XMarkIcon
					className="absolute right-2 top-12 z-10 h-8 w-8 p-2 rounded-sm text-zinc-400 bg-transparent hover:bg-red-500 hover:text-white cursor-pointer"
					onClick={() => onDelete(index,answer.answer)}
				/>
			</div>
		</div>
	);
};

export default Answer;
