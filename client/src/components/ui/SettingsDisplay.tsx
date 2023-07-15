import { TestType } from "../../types/models";
import { Switch } from "./Switch";

interface Props {
	test: TestType;
	className?: string
}

const SettingsDisplay = ({ test,className }: Props) => {
	return (
		<div className={`${className} flex flex-1 flex-col  w-full p-5 gap-2`}>
			<p className="self-start font-medium  ">Active settings:</p>
			<div className="flex flex-col p-3 gap-1">
			<div className="grid grid-cols-4">
					<p className="text-left col-span-3 text-sm">
						Pass criteria: 
					</p>
					<p className="col-span-1 text-sm">{test.passCriteria}%</p>
				</div>
				<div className="grid grid-cols-4">
					<label htmlFor="questions-visible" className="text-left col-span-3 text-sm">
						Questions visible after results
					</label>
					<Switch
						id="questions-visible"
						className="col-span-1"
						defaultChecked={test.showQuestionsOnResults}
						disabled
					/>
				</div>
				<div className="grid grid-cols-4">
					<label htmlFor="questions-visible" className="text-left col-span-3 text-sm">
						Randomize questions
					</label>
					<Switch
						id="questions-visible"
						className="col-span-1"
						defaultChecked={test.randomizeQuestions}
						disabled
					/>
				</div>
				<div className="grid grid-cols-4">
					<label htmlFor="questions-visible" className="text-left col-span-3 text-sm">
						Randomize answers
					</label>
					<Switch
						id="questions-visible"
						className="col-span-1"
						defaultChecked={test.randomizeAnswers}
						disabled
					/>
				</div>
			</div>
		</div>
	);
};

export default SettingsDisplay;
