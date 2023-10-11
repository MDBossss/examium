import { TestType } from "../../../../../shared/models";
import { Button } from "../Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./Dialog";
import { Input } from "../Input";
import { Switch } from "../Switch";
import { useToast } from "../../../hooks/useToast";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Percent, SettingsIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../Tooltip";
import { Combobox } from "../Combobox";

const schema = z.object({
	title: z.string().max(50, { message: "Title must be at most 50 characters" }),
	description: z.string().max(200, { message: "Description must be at most 200 characters" }),
	randomizeQuestions: z.boolean(),
	randomizeAnswers: z.boolean(),
	showQuestionsOnResults: z.boolean(),
	defaultQuestionType: z.enum(["MULTIPLE_CHOICE","CODE"]),
	passCriteria: z
		.number()
		.positive({ message: "Pass criteria must be positive" })
		.int({ message: "Pass criteria must be integer" })
		.max(99, { message: "Pass criteria must be lower than 100" }),
});

interface Props {
	test: TestType;
	setTest: React.Dispatch<React.SetStateAction<TestType>>;
}

const SettingsDialog = ({ test, setTest }: Props) => {
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: test.title,
			description: test.description,
			randomizeQuestions: test.randomizeQuestions,
			randomizeAnswers: test.randomizeAnswers,
			showQuestionsOnResults: test.showQuestionsOnResults,
			passCriteria: test.passCriteria,
			defaultQuestionType: test.defaultQuestionType
		},
	});
	const { toast } = useToast();

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
		setTest((prevTest) => ({
			...prevTest,
			title: data.title,
			description: data.description,
			randomizeQuestions: data.randomizeQuestions,
			randomizeAnswers: data.randomizeAnswers,
			showQuestionsOnResults: data.showQuestionsOnResults,
			passCriteria: data.passCriteria,
			defaultQuestionType: data.defaultQuestionType
		}));
		setDialogOpen(false);
		toast({
			title: "✅ Settings saved.",
		});
	};

	useEffect(() => {
		Object.keys(errors).forEach((field) => {
			const error = errors[field as keyof typeof errors];
			toast({
				description: error?.message,
				variant: "destructive",
			});
		});
	}, [errors]);

	useEffect(() => {
		setValue("title", test.title);
	}, [test.title]);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<Tooltip>
				<DialogTrigger asChild>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							className="inline-flex items-center justify-center flex-1 h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
							onClick={() => setDialogOpen(true)}
						>
							<SettingsIcon className="w-6 h-6 text-slate-400 dark:text-gray-600" />
						</Button>
					</TooltipTrigger>
				</DialogTrigger>
				<TooltipContent>
					<p>Settings</p>
				</TooltipContent>
			</Tooltip>
			<DialogContent className="sm:max-w-[425px] max-h-[90%] overflow-auto">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Settings</DialogTitle>
						<DialogDescription>
							Make changes to your test here. Click save when you're done.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid items-center grid-cols-6 gap-4">
							<label htmlFor="title" className="col-span-2 text-sm text-right">
								Title
							</label>
							<Input
								id="title"
								defaultValue={test.title}
								{...register("title")}
								className={`${errors.title && "focus-visible:ring-red-500"} col-span-4`}
							/>
						</div>
						<div className="grid items-center grid-cols-6 gap-4">
							<label htmlFor="description" className="col-span-2 text-sm text-right">
								Description
							</label>
							<Input
								id="description"
								defaultValue={test.description}
								{...register("description")}
								className={`${errors.description && "focus-visible:ring-red-500"} col-span-4`}
							/>
						</div>
						<div className="grid items-center grid-cols-6 gap-4">
							<div className="absolute z-50 p-1 border rounded-sm bg-my_primary dark:bg-gray-800 dark:border-gray-950 dark:text-gray-950 right-8 border-slate-200 ">
								<Percent className="w-4 h-4 " />
							</div>
							<label htmlFor="pass" className="col-span-2 text-sm text-right">
								Pass criteria
							</label>
							<Input
								id="pass"
								type="number"
								defaultValue={test.passCriteria}
								{...register("passCriteria", { valueAsNumber: true })}
								className={`${errors.passCriteria && "focus-visible:ring-red-500"} col-span-4`}
							/>
						</div>
						<div className="grid items-center grid-cols-6 gap-4">
							<label htmlFor="questionType" className="col-span-2 text-sm text-right">
								Question Type
							</label>
							<Combobox
								className="col-span-4 ml-auto text-right"
								defaultValue={test.defaultQuestionType}
								onChange={(value) => setValue("defaultQuestionType",value)}
							/>
						</div>
						<div className="grid items-center grid-cols-4 gap-4">
							<label htmlFor="questions-visible" className="col-span-3 text-sm text-left">
								Questions visible after results
							</label>
							<Switch
								id="questions-visible"
								className="col-span-1"
								defaultChecked={test.showQuestionsOnResults}
								onCheckedChange={(v) => setValue("showQuestionsOnResults", v)}
								{...register("showQuestionsOnResults")}
							/>
						</div>
						<div className="grid items-center grid-cols-4 gap-4">
							<label htmlFor="randomize-questions" className="col-span-3 text-sm text-left">
								Randomize questions
							</label>
							<Switch
								id="randomize-questions"
								className="col-span-1"
								defaultChecked={test.randomizeQuestions}
								onCheckedChange={(v) => setValue("randomizeQuestions", v)}
								{...register("randomizeQuestions")}
							/>
						</div>
						<div className="grid items-center grid-cols-4 gap-4">
							<label htmlFor="randomizeAnswers" className="col-span-3 text-sm text-left">
								Randomize answers
							</label>
							<Switch
								id="randomizeAnswers"
								className="col-span-1 "
								defaultChecked={test.randomizeAnswers}
								onCheckedChange={(v) => setValue("randomizeAnswers", v)}
								{...register("randomizeAnswers")}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline">
							<input type="submit" value="Save changes" />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default SettingsDialog;
