import { useSession } from "@clerk/clerk-react";
import WelcomeBack from "../components/Overview/WelcomeBack";
import EventActivity from "../components/Overview/EventActivity";
import { Calendar } from "../components/ui/Calendar";
import Forecast from "../components/Overview/Forecast";

const Overview = () => {
	const { session } = useSession();

	return (
		<div className="flex w-full gap-2 mx-auto max-w-7xl">
			<div className="flex flex-col w-8/12 gap-2">
				<WelcomeBack session={session} />
				<div className="flex gap-2">
					<Forecast session={session} />
					<Calendar className="border rounded-sm" ISOWeek />
				</div>
			</div>
			<div className="w-4/12">
				<EventActivity session={session} />
			</div>
		</div>
	);
};

export default Overview;
