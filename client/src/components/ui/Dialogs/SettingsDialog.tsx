import { useEffect, useState } from "react";
import { TestType } from "../../../types/models";
import { Button } from "../Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../Dialog";
import { Input } from "../input";
import { Switch } from "../Switch";
import { useToast } from "../../../hooks/useToast";

interface Props {
	test: TestType;
	setTest: React.Dispatch<React.SetStateAction<TestType>>;
}

const SettingsDialog = ({ test, setTest }: Props) => {
	const [title, setTitle] = useState<string>(test.title);
	const [description, setDescription] = useState<string>(test.description);
	const [randomizeQuestions, setRandomizeQuestions] = useState<boolean>(test.randomizeQuestions);
	const [randomizeAnswers, setRandomizeAnswers] = useState<boolean>(test.randomizeAnswers);
	const [showQuestionsOnResults,setShowQuestionsOnResults] = useState<boolean>(test.showQuestionsOnResults);
	const { toast } = useToast();

	const handleSave = () => {
		setTest((prevTest) => ({
			...prevTest,
			title: title,
			description: description,
			randomizeQuestions: randomizeQuestions,
			randomizeAnswers: randomizeAnswers,
			showQuestionsOnResults: showQuestionsOnResults
		}));

		toast({
			title: "✅ Settings saved.",
		});
	};

	useEffect(() => {
		setTitle(test.title);
	}, [test.title]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="border-slate-200 hover:bg-slate-200 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4"
				>
					Settings
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>
						Make changes to your test here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<label htmlFor="title" className="text-right">
							Title
						</label>
						<Input
							id="title"
							defaultValue={test.title}
							onChange={(e) => setTitle(e.target.value)}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<label htmlFor="description" className="text-right">
							Description
						</label>
						<Input
							id="description"
							className="col-span-3"
							defaultValue={test.description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<label htmlFor="questions-visible" className="text-left col-span-3">
							Questions visible after results
						</label>
						<Switch
							id="questions-visible"
							className="col-span-1"
							defaultChecked={test.showQuestionsOnResults}
							onCheckedChange={(checked) => setShowQuestionsOnResults(checked)}
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<label htmlFor="randomize-questions" className="text-left col-span-3">
							Randomize questions
						</label>
						<Switch
							id="randomize-questions"
							className="col-span-1"
							defaultChecked={test.randomizeQuestions}
							onCheckedChange={(checked) => setRandomizeQuestions(checked)}
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<label htmlFor="randomize-answers" className="text-left col-span-3">
							Randomize answers
						</label>
						<Switch
							id="randomize-answers"
							className="col-span-1"
							defaultChecked={test.randomizeAnswers}
							onCheckedChange={(checked) => setRandomizeAnswers(checked)}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={handleSave}>
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default SettingsDialog;
