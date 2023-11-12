let secondsPassed = 0;
let interval: NodeJS.Timer;

const startTimer = () => {
	interval = setInterval(() => {
		postMessage({ type: "tick" });
	}, 1000);
};

const stopTimer = () => {
	clearInterval(interval);
};

onmessage = (event: MessageEvent) => {
	const { type } = event.data;

	switch (type) {
		case "start":
			startTimer();
			break;
		case "stop":
			stopTimer();
			break;
		default:
			break;
	}
};
