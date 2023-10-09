import { useSession } from "@clerk/clerk-react";
import WelcomeBack from "../components/Overview/WelcomeBack";
import EventActivity from "../components/Overview/EventActivity";

const Overview = () => {
	const { session } = useSession();

	return (
		<div className="flex w-full gap-2 mx-auto max-w-7xl">
			<div className="w-8/12">
				<WelcomeBack session={session} />
			</div>
			<div className="w-4/12">
				<EventActivity session={session}/>
			</div>
		</div>
	);
};

export default Overview;
