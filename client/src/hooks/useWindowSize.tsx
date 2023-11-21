import { useState, useEffect } from "react";

function useWindowSize() {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const debouncedResizeHandler = debounce(() => {
			setWindowSize({ width: window.innerWidth, height: window.innerHeight });
		}, 100);

		debouncedResizeHandler();

		// Add event listener
		window.addEventListener("resize", debouncedResizeHandler);

		// Cleanup on component unmount
		return () => {
			window.removeEventListener("resize", debouncedResizeHandler);
		};
	}, []);

	return windowSize;
}

function debounce(fn: (...args: any[]) => any, ms: number) {
	let timer: ReturnType<typeof setTimeout> | null;
	return (...args: any[]) => {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			timer = null;
			fn(...args);
		}, ms);
	};
}

export default useWindowSize;
