import { format } from "date-fns";
import { EventType } from "../../types/models";
import { CalendarClockIcon } from "lucide-react";

interface Props {
	event: EventType;
}

const UpcomingEventItem = ({ event }: Props) => {
	return (
		<div className="flex gap-2 ">
            <div className="flex flex-col justify-center min-w-[50px]">
			<h2>{format(new Date(event.start), "HH:mm")}</h2>
            </div>
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2">
					<h4 className="text-sm font-medium">{event.title}</h4>
					<CalendarClockIcon className="w-5 h-5" />
				</div>
				<p className="text-xs">
					<span className="text-blue-600">{event.location}</span> • {event.description}
				</p>
			</div>
		</div>
	);
};

export default UpcomingEventItem;
