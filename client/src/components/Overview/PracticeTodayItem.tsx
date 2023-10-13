import { useNavigate } from "react-router-dom";
import { TestType } from "../../../../shared/models";
import { parseQuestionType } from "../../utils/testUtils";

interface Props {
	test: TestType;
	selectedLayout: "grid" | "column";
}

const PracticeTodayItem = ({ test, selectedLayout }: Props) => {
	const navigate = useNavigate();

	return (
		<div
			className={`${
				selectedLayout === "grid" ? "flex-col text-center" : "flex-row"
			} flex justify-between gap-2 p-5 bg-blue-500 rounded-sm cursor-pointer dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700`}
			onClick={() => navigate(`/solve/${test.id}`)}
		>
			<div className="flex flex-col justify-between gap-5">
				<div className="flex flex-col gap-1">
					<h4 className="font-medium">{test.title}</h4>
					<p className="text-xs">{test.description}</p>
				</div>
				<p className="text-xs italic">{parseQuestionType(test.defaultQuestionType)}</p>
			</div>
			<div className="flex flex-col items-center gap-1">
				<div className="flex items-center px-4 py-2 text-2xl font-bold rounded-sm w-min bg-slate-200 aspect-square text-zinc-800">
					{test.questions.length}
				</div>
				<p className="text-xs">Questions</p>
			</div>
		</div>
	);
};

export default PracticeTodayItem;
