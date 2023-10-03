import { Scheduler } from "@aldabil/react-scheduler";
import { SchedulerRef } from "@aldabil/react-scheduler/types";
import { useMemo, useRef, useState } from "react";
import { useThemeStore } from "../store/themeStore";
import SchedulerEditor from "../components/SchedulerEditor";
import SearchBar from "../components/SearchBar";

const Schedule = () => {
	const { theme } = useThemeStore();
	const [date, setDate] = useState<Date>(useMemo(() => new Date(), [])); // fetch to here? or use react query
	const schedulerRef = useRef<SchedulerRef>(null);

	return (
		<div className="flex flex-col w-full gap-10 p-4 pt-5 max-w-screen sm:p-10">
			<SearchBar/>
			<div className={`${theme === "dark" ? "darkmode-scheduler" : "lightmode-scheduler"}`}>
				<Scheduler
					ref={schedulerRef}
					customEditor={(scheduler) => (
						<SchedulerEditor scheduler={scheduler} schedulerRef={schedulerRef} />
					)}
					viewerExtraComponent={(fields, event) => {
						return <p>{event.description}</p>;
					}}
					view="week"
					fields={[{ name: "recurrencePattern", type: "select" }]}
					month={{
						weekDays: [0, 1, 2, 3, 4, 5, 6],
						weekStartOn: 1,
						startHour: 8,
						endHour: 21,
						navigation: true,
						disableGoToDay: false,
					}}
					week={{
						weekDays: [0, 1, 2, 3, 4, 5, 6],
						weekStartOn: 1,
						startHour: 8,
						endHour: 21,
						step: 30,
						navigation: true,
						disableGoToDay: false,
					}}
					day={{
						startHour: 8,
						endHour: 21,
						step: 30,
						navigation: true,
					}}
					draggable={false}
					editable={true}
					deletable={true}
					// locale={hr}
					hourFormat="24"
					events={[
						{
							event_id: 1,
							title: "Event 1",
							start: new Date("2023-10-02 09:30:00"),
							end: new Date("2023-10-02 11:30:00"),
							color: "#1d4ed8",
						},
						{
							event_id: 2,
							title: "Event 2",
							start: new Date("2023-10-03 09:30:00"),
							end: new Date("2023-10-03 10:30:00"),
							color: "#1d4ed8",
						},
						{
							event_id: 3,
							title: "Dan za kupanje",
							start: new Date("2023-10-04 09:30:00"),
							end: new Date("2023-10-04 10:30:00"),
							allDay: true,
							color: "green",
						},
					]}
				/>
			</div>
		</div>
	);
};

export default Schedule;