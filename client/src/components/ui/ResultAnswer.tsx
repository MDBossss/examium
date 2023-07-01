import { AnswerType } from "../../types/models";

interface Props {
	answer: AnswerType;
	answerIndex: number;
    isChecked: boolean
}


const ResultAnswer = ({ answer, answerIndex, isChecked }: Props) => {

    const conditionalColors = () => {
        if(answer.isCorrect && isChecked){
            return "text-green-500";
        }
        if(answer.isCorrect && !isChecked){
            return "text-green-500";
        }
        if(!answer.isCorrect && isChecked){
            return "text-red-500";
        }
    }    


	return (
		<div className="grid grid-cols-12 items-center">
			<p className={`${conditionalColors()} col-span-1 p-3 text-medium font-medium text-slate-600 border-r border-slate-200`}>
				{String.fromCharCode(65 + answerIndex)}
			</p>
            <p className={`${conditionalColors()} col-span-11 text-medium font-medium text-slate-400 px-5 py-3`}>{answer.answer}</p>
		</div>
	);
};

export default ResultAnswer;
