import CircularProgress from "./CircularProgress";

interface UserScore {
	value: number;
	percentage: number;
}
[]
interface Props{
    userScore:UserScore
}

const ScoreDisplay = ({userScore}:Props) => {
	return (
		<div className="flex flex-col p-5 flex-1 border-r border-slate-200 items-center gap-5">
			<p className="self-start font-medium text- ">Percentage scored:</p>
			<div>
				<CircularProgress
					percentage={userScore.percentage}
					primaryColor={
						userScore.percentage >= 50 ? ["#22C55E", "#22C55E"] : ["#EF4444", "#EF4444"]
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
