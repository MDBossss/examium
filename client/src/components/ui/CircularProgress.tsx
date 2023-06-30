import { FC } from "react";

interface GradientCircleProgressbarProps {
	percentage: number;
	width?: number;
	strokeWidth?: number;
	strokeLinecap?: "round" | "square" | "butt";
	fontSize?: string;
	fontColor?: string;
	fontFamily?: string;
	primaryColor?: [string, string];
	secondaryColor?: string;
	fill?: string;
	hidePercentageText?: boolean;
}

const GradientCircleProgressbar: FC<GradientCircleProgressbarProps> = ({
	percentage,
	width = 200,
	strokeWidth = 5,
	fontSize,
	fontColor,
	fontFamily,
	primaryColor = ["#00BBFF", "#92d7f1"],
	secondaryColor = "transparent",
	fill = "transparent",
	hidePercentageText = false,
	strokeLinecap = "round",
}) => {
	const PI = 3.14;
	const R = width / 2 - strokeWidth * 2;

	let circumference = 2 * PI * R;
	let offset = circumference - (percentage / 100) * circumference;
	let gradientId = `${primaryColor[0]}${primaryColor[1]}`.replace(/#/g, "");

	return (
		<div
			className="inline-block rounded-full relative"
			style={{
				height: `${width}px`,
				width: `${width}px`,
			}}
		>
			{!hidePercentageText && (
				<div className="absolute h-full w-full top-0 left-0 flex justify-center items-center flex-col text-center">
					<span
						style={{
							fontSize,
							fontFamily,
							color: fontColor,
						}}
					>
						{percentage}%
					</span>
				</div>
			)}

			<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stopColor={primaryColor[0]} />
					<stop offset="100%" stopColor={primaryColor[1]} />
				</linearGradient>
				<circle
					strokeWidth={strokeWidth}
					fill="transparent"
					r={R}
					cx={width / 2}
					cy={width / 2}
					stroke={secondaryColor}
					strokeDasharray={`${circumference} ${circumference}`}
				/>
				<circle
                    className="transform rotate-[-90deg] origin-center"
					strokeWidth={strokeWidth}
					fill={fill}
					r={R}
					cx={width / 2}
					cy={width / 2}
					stroke={`url(#${gradientId})`}
					strokeLinecap={strokeLinecap}
					strokeDasharray={`${circumference} ${circumference}`}
					strokeDashoffset={offset}
				/>
			</svg>
		</div>
	);
};

export default GradientCircleProgressbar;
