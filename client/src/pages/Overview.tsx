import { useSession } from "@clerk/clerk-react";
import WelcomeBack from "../components/Overview/WelcomeBack";
import EventActivity from "../components/Overview/EventActivity";
import { Calendar } from "../components/ui/Calendar";
import Forecast from "../components/Overview/Forecast";

const Overview = () => {
	const { session } = useSession();

	return (
		<div className="flex flex-col-reverse w-full gap-2 mx-auto lg:flex-row max-w-7xl">
			<div className="flex flex-col gap-2 lg:w-8/12">
				<WelcomeBack session={session} />
				<div className="flex flex-col gap-2 xl:flex-row">
					<Forecast session={session} />
					<div className="flex border rounded-sm">
						<Calendar className="mx-auto" ISOWeek />
					</div>
				</div>
			</div>
			<div className="lg:w-4/12">
				<EventActivity session={session} />
			</div>
		</div>
	);
};

export default Overview;
