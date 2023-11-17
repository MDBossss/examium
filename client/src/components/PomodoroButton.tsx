import { useState } from "react";
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
import pomodoroAlert from "/sounds/pomodoroAlert.mp3";
import useTitle from "../hooks/useTitle";
import { differenceInSeconds, parseISO } from "date-fns";
import PomodoroWorker from "../workers/pomodoroWorker?worker";

const audio = new Audio(pomodoroAlert);

const worker = new PomodoroWorker();

interface PomodoroState {
	secondsPassed: number;
	status: "study" | "break" | "off";
	lastStatus: "study" | "break" | "off";
	breakCount: number;
	isModalOpen: boolean;
	lastUpdated: string;
}

const STUDY_DURATION = 25 * 60;
const SMALL_BREAK_DURATION = 5 * 60;
const LONG_BREAK_DURATION = 25 * 60;

const DEFAULT_POMODORO_STATE: PomodoroState = {
	secondsPassed: 0,
	status: "off",
	lastStatus: "study",
	breakCount: 0,
	isModalOpen: false,
	lastUpdated: new Date().toISOString(),
};

const PomodoroButton = () => {
	const [pomodoroState, setPomodoroState] = useState<PomodoroState>(() => {
		const storedState = localStorage.getItem("pomodoroState");
		// If the stored state is not available or the last update is older than 1 minute,
		// return the default state, otherwise parse the stored state
		return storedState &&
			differenceInSeconds(new Date(), parseISO(JSON.parse(storedState).lastUpdated)) < 60
			? JSON.parse(storedState)
			: DEFAULT_POMODORO_STATE;
	});

	worker.onmessage = (event) => {
		const { type, data }: { type: string; data: PomodoroState } = event.data;

		switch (type) {
			case "tick":
				setPomodoroState((prev) => ({
					...data,
					isModalOpen: prev.isModalOpen,
				}));
				break;
			case "pause":
				setPomodoroState((prev) => ({
					...data,
					isModalOpen: prev.isModalOpen,
				}));
				localStorage.setItem("pomodoroState", JSON.stringify({ ...data, isModalOpen: false }));
				break;
			case "restart":
				setPomodoroState((prev) => ({
					...data,
					isModalOpen: prev.isModalOpen,
				}));
				localStorage.setItem("pomodoroState", JSON.stringify({ ...data, isModalOpen: false }));
				break;

			case "store":
				localStorage.setItem(
					"pomodoroState",
					JSON.stringify({ ...data, isModalOpen: false, status: "off" })
				);
				break;
			case "done":
				setPomodoroState(data);
				audio.play();
				break;
		}
	};

	const handleToggleTimer = () => {
		if (pomodoroState.status === "off") {
			worker.postMessage({ type: "start", data: pomodoroState });
		} else {
			worker.postMessage({ type: "pause" });
		}
	};

	const handleRestartTimer = () => {
		worker.postMessage({ type: "restart" });
	};

	const getDuration = () => {
		switch (pomodoroState.status) {
			case "study":
				return STUDY_DURATION;
			case "break":
				return pomodoroState.breakCount < 4 ? SMALL_BREAK_DURATION : LONG_BREAK_DURATION;
			case "off":
				return pomodoroState.lastStatus === "break" && pomodoroState.breakCount < 4
					? SMALL_BREAK_DURATION
					: STUDY_DURATION;
		}
	};

	const getTitle = () => {
		switch (pomodoroState.status) {
			case "off":
				return pomodoroState.secondsPassed > 0 ? "CONTINUE POMODORO" : "START POMODORO";
			case "break":
				return "BREAK TIME";
			case "study":
				return "STUDY TIME";
		}
	};

	// Calculate the dynamic gradient based on the progress
	const dynamicGradient = `linear-gradient(to top, black ${
		(pomodoroState.secondsPassed / getDuration()) * 100
	}%, transparent ${(pomodoroState.secondsPassed / getDuration()) * 100}%)`;

	// Calculate remaining minutes and seconds
	const remainingMinutes = Math.floor((getDuration() - pomodoroState.secondsPassed) / 60)
		.toString()
		.padStart(2, "0");
	const remainingSeconds = ((getDuration() - pomodoroState.secondsPassed) % 60)
		.toString()
		.padStart(2, "0");

	// Format the remaining time as "mm:ss"
	const formattedRemainingTime = `${remainingMinutes}:${remainingSeconds} remaining`;

	useTitle(
		pomodoroState.status !== "off" ? `Examium | ${remainingMinutes}:${remainingSeconds}` : "Examium"
	);

	return (
		<Dialog
			open={pomodoroState.isModalOpen}
			onOpenChange={(val) =>
				setPomodoroState((prev) => ({
					...prev,
					isModalOpen: val,
				}))
			}
		>
			<DialogTrigger>
				<div className="relative w-8 h-8 cursor-pointer select-none group">
					<img
						src="/tomato.svg"
						className="absolute w-full transition-all grayscale rotate-12 group-hover:scale-110 group-hover:rotate-6"
					/>
					<ActionTooltip
						label={pomodoroState.status === "off" ? "Start pomodoro" : formattedRemainingTime}
					>
						<img
							src="/tomato.svg"
							className="w-full transition-all rotate-12 group-hover:scale-110 group-hover:rotate-6"
							style={{
								maskImage: dynamicGradient,
								WebkitMaskImage: dynamicGradient,
								transition: "mask-image 0.5s ease",
							}}
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
					<h2
						className={`${
							pomodoroState.status === "off" ? "text-gray-500" : "text-red-500"
						} text-3xl`}
					>
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
								pomodoroState.status === "off" ? "bg-gray-500" : "bg-red-500"
							} min-w-[100px] p-5 rounded-sm`}
						>
							{remainingMinutes}
						</p>
						<p>:</p>
						<p
							className={`${
								pomodoroState.status === "off" ? "bg-gray-500" : "bg-red-500"
							} min-w-[100px] p-5 rounded-sm`}
						>
							{remainingSeconds}
						</p>
					</div>
					<div className="flex w-full gap-1">
						<Button className="flex flex-1 gap-1" onClick={() => handleToggleTimer()}>
							{pomodoroState.status === "off" ? (
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
