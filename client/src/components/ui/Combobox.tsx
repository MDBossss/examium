import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./Dropdown";
import { QuestionVariantsType } from "../../../../shared/models";

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
				<Button variant="outline" className={`w-full justify-between font-normal ${className}`}>
					{value ? options.find((option) => option.value === value)?.label : "Select question type"}
					<ChevronsUpDown className="w-4 h-4 mr-2" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-[200px] -right-20 flex flex-col gap-1">
				{options.map((option) => (
					<DropdownMenuItem
						key={option.value}
						className={`${option.value === value && " mb-1"}`}
						onClick={() => handleChange(option.value)}
					>
						{option.value === value && <Check className="w-4 h-4 mr-2" />} {option.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
