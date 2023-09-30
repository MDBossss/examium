import { memo, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Button } from "./Button";
import { cn } from "../../lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./Calendar";
import format from "date-fns/format";
import { Label } from "./Label";
import CustomDateTimeInput from "./TimeInput";

interface DateTimePickerProps {
	date: Date;
	setDate: (date: Date) => void;
	className?: string
}

export const DateTimePicker = ({ date, setDate,className }: DateTimePickerProps) => {
	const [selectedDateTime, setSelectedDateTime] = useState<Date>(useMemo(() =>date, []));

	const handleSelect = (selected: Date, time?: Date) => {
		const selectedDay = new Date(selected);
		const modifiedDay = new Date(
			selectedDay.getFullYear(),
			selectedDay.getMonth(),
			selectedDay.getDate(),
			time ? time.getHours() : selectedDateTime.getHours(),
			time ? time.getMinutes() : selectedDateTime.getMinutes()
		);

		setSelectedDateTime(modifiedDay);
		setDate(modifiedDay);
	};

	const handleSetTime = (time: Date) => {
		handleSelect(selectedDateTime, time);
	};

    const MemoizedCalendar = memo(Calendar);

	return (
		<Popover>
			<PopoverTrigger asChild className="z-[9999]">
				<Button
					variant={"outline"}
					className={cn(
						`${className} justify-start text-left font-normal",
						!date && "text-muted-foreground`
					)}
				>
					<CalendarIcon className="w-4 h-4 mr-2" />
					{date ? format(selectedDateTime, "eee HH:mm") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="z-[9999] w-auto p-0">
				<MemoizedCalendar
					mode="single"
					selected={selectedDateTime}
					onSelect={(date) => handleSelect(date!)}
					initialFocus
				/>

				<>
					<div className="px-4 pt-0 pb-4">
						<Label>Time</Label>
						<CustomDateTimeInput initialDate={date} onChange={(date) => handleSetTime(date)} />
					</div>
					{!selectedDateTime && <p>Please pick a day.</p>}
				</>
			</PopoverContent>
		</Popover>
	);
};

export default DateTimePicker;
