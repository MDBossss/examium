import CircularProgress from "./CircularProgress";

interface UserScore {
	value: number;
	percentage: number;
}
[]
interface Props{
    userScore:UserScore,
	passCriteria:number,
	className?:string
}

const ScoreDisplay = ({userScore,passCriteria,className}:Props) => {
	return (
		<div className={`${className} flex flex-col p-5 flex-1 items-center gap-5`}>
			<p className="self-start font-medium ">Percentage scored:</p>
			<div>
				<CircularProgress
					percentage={userScore.percentage}
					primaryColor={
						userScore.percentage >= passCriteria ? ["#22C55E", "#22C55E"] : ["#EF4444", "#EF4444"]
					}
					strokeWidth={7}
					secondaryColor="#E2E8F0"
					fontSize="30px"
				/>
			</div>
		</div>
	);
};

export default ScoreDisplay;
