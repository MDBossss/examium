import { useEffect, useState } from "react";
import { ActionTooltip } from "./ui/ActionTooltip";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/Dialogs/Dialog";
import { Button } from "./ui/Button";
import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";

const STUDY_DURATION = 0.1 * 60;
const SMALL_BREAK_DURATION = 0.05 * 60;
const LONG_BREAK_DURATION = 0.1 * 60; 

const PomodoroButton = () => {
	const [secondsPassed, setSecondsPassed] = useState(0);
	const [status, setStatus] = useState<"study" | "break" | "off">("off");
	const [lastStatus, setLastStatus] = useState<"study" | "break" | "off">("study");
    const [breakCount,setBreakCount] = useState<number>(0);
    const [isModalOpen,setIsModalOpen] = useState<boolean>(false);

	console.log(`Status: ${status} \n Last Status: ${lastStatus} \n Break Count: ${breakCount}`);

	useEffect(() => {
		let interval: NodeJS.Timer;

		const updateProgress = () => {
			setSecondsPassed((prevSeconds) => prevSeconds + 1);

			if (secondsPassed === STUDY_DURATION && status === "study") {
                setIsModalOpen(true)
				setSecondsPassed(0);
				setLastStatus(status);
				setStatus("break");
				clearInterval(interval);
			}

			if (secondsPassed === SMALL_BREAK_DURATION && status === "break" && breakCount < 4) {
                setIsModalOpen(true)
				setSecondsPassed(0);
                setBreakCount((prev) => prev + 1);
				setLastStatus(status);
				setStatus("study");
				clearInterval(interval);
			}

            if(secondsPassed === LONG_BREAK_DURATION && status === "break"){
                setIsModalOpen(true)
                setSecondsPassed(0);
                setLastStatus(status);
                setStatus("study");
                setBreakCount(0);
                clearInterval(interval);
            }

		};
		if (status !== "off") {
			interval = setInterval(updateProgress, 1000);
		}

		return () => clearInterval(interval);
	}, [secondsPassed, status]);

	const handleToggleTimer = () => {
		if (status === "off") {
			setStatus(lastStatus);
		} else {
			setStatus("off");
			setLastStatus(status);
		}
	};

	const handleRestartTimer = () => {
		setLastStatus("study");
		setStatus("off");
        setBreakCount(0);
		setSecondsPassed(0);
	};

	const getDuration = () => {
		switch (status) {
			case "study":
				return STUDY_DURATION;
			case "break":
				return breakCount < 4 ? SMALL_BREAK_DURATION : LONG_BREAK_DURATION;
			case "off":
				return lastStatus === "break" && breakCount < 4 ? SMALL_BREAK_DURATION : STUDY_DURATION;
		}
	};

	const getTitle = () => {
		switch (status) {
			case "off":
				return secondsPassed > 0 ? "CONTINUE POMODORO" : "START POMODORO";
			case "break":
				return "BREAK TIME";
			case "study":
				return "STUDY TIME";
		}
	};

	// Calculate the dynamic gradient based on the progress
	const dynamicGradient = `linear-gradient(to top, black ${
		(secondsPassed / getDuration()) * 100
	}%, transparent ${(secondsPassed / getDuration()) * 100}%)`;

	// Calculate remaining minutes and seconds
	const remainingMinutes = Math.floor((getDuration() - secondsPassed) / 60)
		.toString()
		.padStart(2, "0");
	const remainingSeconds = ((getDuration() - secondsPassed) % 60).toString().padStart(2, "0");

	// Format the remaining time as "mm:ss"
	const formattedRemainingTime = `${remainingMinutes}:${remainingSeconds} remaining`;

	return (
		<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
			<DialogTrigger>
				<div className="relative w-8 h-8 cursor-pointer group">
					<img
						src="/tomato.svg"
						className="absolute w-full transition-all grayscale rotate-12 group-hover:scale-110 group-hover:rotate-6"
					/>
					<ActionTooltip label={status === "off" ? "Start pomodoro" : formattedRemainingTime}>
						<img
							src="/tomato.svg"
							className="w-full transition-all rotate-12 group-hover:scale-110 group-hover:rotate-6"
							style={{ maskImage: dynamicGradient, WebkitMaskImage: dynamicGradient }}
						/>
					</ActionTooltip>
				</div>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] max-h-[90%] overflow-auto">
				<DialogHeader>
					<DialogTitle>Pomodoro Timer</DialogTitle>
					<DialogDescription>
						A simple method to balance focus with deliberate breaks
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col items-center gap-5 text-center">
					<h2 className={`${status === "off" ? "text-gray-500" : "text-red-500"} text-3xl`}>
						{getTitle()}
					</h2>

					<div className="relative w-1/2 cursor-pointer group">
						<img
							src="/tomato.svg"
							className="absolute w-full transition-all grayscale rotate-12 group-hover:scale-110 group-hover:rotate-6"
						/>
						<img
							src="/tomato.svg"
							className="w-full transition-all rotate-12 group-hover:scale-110 group-hover:rotate-6"
							style={{ maskImage: dynamicGradient, WebkitMaskImage: dynamicGradient }}
						/>
					</div>

					<div className="flex items-center gap-3 text-5xl ">
						<p
							className={`${
								status === "off" ? "bg-gray-500" : "bg-red-500"
							} min-w-[100px] p-5 rounded-sm`}
						>
							{remainingMinutes}
						</p>
						<p>:</p>
						<p
							className={`${
								status === "off" ? "bg-gray-500" : "bg-red-500"
							} min-w-[100px] p-5 rounded-sm`}
						>
							{remainingSeconds}
						</p>
					</div>
					<div className="flex w-full gap-1">
						<Button className="flex flex-1 gap-1" onClick={() => handleToggleTimer()}>
							{status === "off" ? (
								<>
									<PlayIcon className="w-6 h-6" /> Start timer
								</>
							) : (
								<>
									<PauseIcon className="w-6 h-6" /> Stop timer
								</>
							)}
						</Button>
						<Button className="flex gap-1 bg-red-500" onClick={() => handleRestartTimer()}>
							<RotateCcwIcon className="w-6 h-6" />
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default PomodoroButton;
