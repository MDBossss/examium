/**
 * Using a web worker because the timer gets "delayed" with time and is not
 * accurate using setInterval(1000) -> AT LEAST 1000ms of delay, so most of the
 * time its more and timer is not accurate. Creating a web worker means making
 * this code run on another thread and will be much more accurate and will not
 * get throttled when the tab is not focused.
 */

interface PomodoroState {
	secondsPassed: number;
	status: "study" | "break" | "off";
	lastStatus: "study" | "break" | "off";
	breakCount: number;
	isModalOpen: boolean;
	lastUpdated: string;
}

let pomodoroState: PomodoroState = {
	secondsPassed: 0,
	status: "off",
	lastStatus: "study",
	breakCount: 0,
	isModalOpen: false,
	lastUpdated: new Date().toISOString(),
};

let interval: NodeJS.Timer;

const STUDY_DURATION = 25 * 60;
const SMALL_BREAK_DURATION = 5 * 60;
const LONG_BREAK_DURATION = 25 * 60;

const updateProgress = () => {
	// Update state every second and send message from worker
	pomodoroState = {
		...pomodoroState,
		secondsPassed: pomodoroState.secondsPassed + 1,
		lastUpdated: new Date().toISOString(),
	};
	postMessage({ type: "tick", data: { ...pomodoroState } });

	// Store data to localstorage every 10 seconds
	if (
		pomodoroState.secondsPassed % 10 === 0 &&
		pomodoroState.secondsPassed > 0 &&
		pomodoroState.secondsPassed !== STUDY_DURATION &&
		pomodoroState.secondsPassed !== SMALL_BREAK_DURATION
	) {
		postMessage({ type: "store", data: { ...pomodoroState } });
	}

	// Check if studying time is done
	if (pomodoroState.secondsPassed === STUDY_DURATION && pomodoroState.status === "study") {
		pomodoroState = {
			...pomodoroState,
			secondsPassed: 0,
			lastStatus: pomodoroState.status,
			status: "break",
			isModalOpen: true,
		};
		postMessage({ type: "done", data: { ...pomodoroState } });
	}

	// Check if small break is done
	if (
		pomodoroState.secondsPassed === SMALL_BREAK_DURATION &&
		pomodoroState.status === "break" &&
		pomodoroState.breakCount < 4
	) {
		pomodoroState = {
			...pomodoroState,
			secondsPassed: 0,
			lastStatus: pomodoroState.status,
			status: "study",
			breakCount: pomodoroState.breakCount + 1,
			isModalOpen: true,
		};
		postMessage({ type: "done", data: { ...pomodoroState } });
	}

	// Check if big break is done
	if (pomodoroState.secondsPassed === LONG_BREAK_DURATION && pomodoroState.status === "break") {
		pomodoroState = {
			...pomodoroState,
			secondsPassed: 0,
			lastStatus: pomodoroState.status,
			status: "study",
			breakCount: 0,
			isModalOpen: true,
		};
		postMessage({ type: "done", data: { ...pomodoroState } });
	}
};

// Handle incoming messages from component
onmessage = (event) => {
	const { type, data }: { type: string; data?: PomodoroState } = event.data;

	switch (type) {
		case "start":
			if (data) {
				pomodoroState = data;
			}
			if (pomodoroState.status == "off") {
				pomodoroState = {
					...pomodoroState,
					status: pomodoroState.lastStatus,
				};
				postMessage({ type: "tick", data: { ...pomodoroState } });
				interval = setInterval(updateProgress, 1000);
			}
			break;
		case "pause":
			pomodoroState = {
				...pomodoroState,
				lastStatus: pomodoroState.status,
				status: "off",
			};
			clearInterval(interval);
			postMessage({ type: "pause", data: { ...pomodoroState } });
			break;

		case "restart":
			pomodoroState = {
				...pomodoroState,
				secondsPassed: 0,
				status: "off",
				lastStatus: "study",
				breakCount: 0,
			};
			clearInterval(interval);
			postMessage({ type: "restart", data: { ...pomodoroState } });
			break;
		default:
			break;
	}
};
