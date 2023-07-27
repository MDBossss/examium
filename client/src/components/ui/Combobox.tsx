import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./Dropdown";
import { QuestionVariantsType } from "../../types/models";

interface optionsProps{
    value: QuestionVariantsType["type"],
    label: string
}

const options: optionsProps[] = [
	{
		value: "CODE",
		label: "Code",
	},
	{
		value: "MULTIPLE_CHOICE",
		label: "Multiple Choice",
	},
];

interface Props {
	className?: string;
	defaultValue?: QuestionVariantsType["type"];
    onChange: (value: QuestionVariantsType["type"]) => void
}

export function Combobox({ className, defaultValue, onChange }: Props) {
	const [value, setValue] = useState<QuestionVariantsType["type"] | string>(defaultValue || "");

    const handleChange = (value: QuestionVariantsType["type"]) => {
        setValue(value);
        onChange(value)
    }

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className={`w-full justify-between ${className}`}>
					{value ? options.find((option) => option.value === value)?.label : "Select question type"}
					<ChevronsUpDown className="mr-2 h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-[200px] -right-20">
				{options.map((option) => (
					<DropdownMenuItem
						key={option.value}
						className={`${option.value === value && "bg-slate-100 mb-1"} hover:bg-slate-200`}
						onClick={() => handleChange(option.value)}
					>
						{option.value === value && <Check className="h-4 w-4 mr-2" />} {option.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
