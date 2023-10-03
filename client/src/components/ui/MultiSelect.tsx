import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "./Badge";
import { Command, CommandGroup, CommandItem } from "./Command";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "../../lib/utils";

type OptionType = Record<"value" | "label", string>;

interface Props {
	options: OptionType[];
	selected: OptionType[];
	onChange: (options: OptionType[]) => void;
    placeholder?: string;
	className?: string;
}

export function MultiSelect({ options, selected, onChange, className, placeholder }: Props) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [open, setOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState("");

	const handleUnselect = (option: OptionType) => {
		onChange(selected.filter((s) => s.value !== option.value));
	};

	const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
		const input = inputRef.current;
		if (input) {
			if (e.key === "Delete" || e.key === "Backspace") {
				if (input.value === "") {
					const newSelected = [...selected];
					newSelected.pop();
					onChange(newSelected);
				}
			}
			// This is not a default behaviour of the <input /> field
			if (e.key === "Escape") {
				input.blur();
			}
		}
	}, []);

    const selectables = options.filter((option) => {
        return !selected.some((selectedOption) => selectedOption.value === option.value);
      });
      

	return (
		<Command onKeyDown={handleKeyDown} className="col-span-3 overflow-visible bg-transparent">
			<div className="px-3 py-2 text-sm border rounded-md group border-input ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
				<div className="flex flex-wrap gap-1">
					{selected.map((option) => {
						return (
							<Badge key={option.value} variant="secondary">
								{option.label}
								<button
									className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleUnselect(option);
										}
									}}
									onMouseDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									onClick={() => handleUnselect(option)}
								>
									<X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
								</button>
							</Badge>
						);
					})}
					{/* Avoid having the "Search" Icon */}
					<CommandPrimitive.Input
						ref={inputRef}
						value={inputValue}
						onValueChange={setInputValue}
						onBlur={() => setOpen(false)}
						onFocus={() => setOpen(true)}
						placeholder={placeholder || "Select option..."}
						className={cn(`${className}  flex-1 ml-2 bg-transparent outline-none placeholder:text-muted-foreground`)}
					/>
				</div>
			</div>
			<div className="relative mt-2">
				{open && selectables.length > 0 ? (
					<div className="absolute top-0 z-10 w-full border rounded-md shadow-md outline-none bg-popover text-popover-foreground animate-in">
						<CommandGroup className="h-full overflow-auto">
							{selectables.map((option) => {
								return (
									<CommandItem
										key={option.value}
										onMouseDown={(e:any) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onSelect={() => {
											setInputValue("");
											onChange([...selected, option]);
										}}
										className={"cursor-pointer"}
									>
										{option.label}
									</CommandItem>
								);
							})}
						</CommandGroup>
					</div>
				) : null}
			</div>
		</Command>
	);
}
