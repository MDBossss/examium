import { memo, useMemo, useRef, useState } from "react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./Calendar";
import format from "date-fns/format";
import { Label } from "./Label";
import TimeInput from "./TimeInput";
import useClickOutside from "../../hooks/useClickOutside";
import { isEqual } from "date-fns";

interface DateTimePickerProps {
	date: Date;
	setDate: (date: Date) => void;
	className?: string;
	id?: string;
}

export const DateTimePicker = ({ date, setDate, className, id }: DateTimePickerProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const [selectedDateTime, setSelectedDateTime] = useState<Date>(useMemo(() => date, []));
	const [isOpen, setIsOpen] = useState<boolean>(false);

	useClickOutside(ref, () => setIsOpen(false));

	const handleSelect = (selected: Date, time?: Date) => {
        if(selected === undefined && time === undefined){
            return
        }
		const selectedDay = new Date(selected);
		const modifiedDay = new Date(
			selectedDay.getFullYear(),
			selectedDay.getMonth(),
			selectedDay.getDate(),
			time ? time.getHours() : selectedDateTime.getHours(),
			time ? time.getMinutes() : selectedDateTime.getMinutes()
		);

        if(isEqual(modifiedDay,selectedDateTime)){
            console.log("dates equal")
            return
        }
        else{
            console.log("not same dates")
            console.log(selectedDateTime)
        }

		setSelectedDateTime(modifiedDay);
		setDate(modifiedDay);
	};

	const handleSetTime = (time: Date) => {
		handleSelect(selectedDateTime, time);
	};

	const MemoizedCalendar = memo(Calendar);

	return (
		<div ref={ref} className={cn(`${className}`)}>
			<Button
				variant={"outline"}
				onClick={() => setIsOpen(true)}
				className={cn(
					`w-full justify-start text-left font-normal",
						!date && "text-muted-foreground`
				)}
			>
				<CalendarIcon className="w-4 h-4 mr-2" />
				{date ? format(selectedDateTime, "eee HH:mm") : <span>Pick a date</span>}
			</Button>
			{isOpen && (
				<div
					className={cn(
						"absolute z-50 w-min rounded-md border bg-popover  text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 "
					)}
				>
					<MemoizedCalendar
						mode="single"
						selected={selectedDateTime}
						onSelect={(date) => handleSelect(date!)}
						initialFocus
					/>

					<>
						<div className="px-4 pt-0 pb-4">
							<Label htmlFor={id}>Time</Label>
							<TimeInput name={id} initialDate={date} onChange={(date) => handleSetTime(date)} />
						</div>
						{!selectedDateTime && <p>Please pick a day.</p>}
					</>
				</div>
			)}
		</div>
	);
};

export default DateTimePicker;
