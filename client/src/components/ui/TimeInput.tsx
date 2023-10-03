import { format } from "date-fns";
import { useState, ChangeEvent, useMemo } from "react";
import { Input } from "./Input";

interface TimeInputProps {
	initialDate?: Date;
	onChange: (newDate: Date) => void;
}

function TimeInput({ initialDate, onChange }: TimeInputProps) {
	// Initialize state with the provided date or the current date if none provided
	const [date] = useState<Date>(initialDate || new Date());
	const [time, setTime] = useState<string>(
        useMemo(() => {
          if (initialDate) {
            return initialDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
          }
          return "";
        }, [initialDate])
      );
	const numberRegex = /[0-9]/;

    //put this into a timeutils file
    const isValidTime = (inputTime: string) => {
        return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(inputTime);
    }

	const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.persist();
		let inputTime = e.target.value;

		if (inputTime[2] !== ":" && inputTime[2] && inputTime[1] !== ":") {
			inputTime = inputTime.slice(0, 2) + ":" + inputTime.slice(2);
		}

		if (
			!numberRegex.test(inputTime[inputTime.length - 1]) &&
			inputTime.length !== 3 &&
			inputTime.length !== 0
		) {
			return;
		}

		// Ensure the input follows the HH:mm format
		setTime(inputTime);
		if (isValidTime(inputTime)) {
			const [hours, minutes] = inputTime.split(":");
			const newDate = new Date(date);
			newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
			onChange(newDate);
		}
	};

	const handleBlur = () => {
		// When input loses focus (onBlur), validate and format the time
		const inputTime = time.trim();
		// Ensure the input follows the HH:mm format
		if (isValidTime(inputTime)) {
			setTime(inputTime);
			const [hours, minutes] = inputTime.split(":");
			const newDate = new Date(date);
			newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
			onChange(newDate);
		} else {
			// If input does not match HH:mm format, reset to previous valid time
			setTime(format(date, "HH:mm"));
		}
	};

	return (
		<Input
			type="text"
			placeholder="HH:mm"
			value={time}
			onChange={(e) => handleTimeChange(e)}
			pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
			maxLength={5}
			inputMode="numeric"
			disabled={false}
			onBlur={() => handleBlur()}
		/>
	);
}

export default TimeInput;
