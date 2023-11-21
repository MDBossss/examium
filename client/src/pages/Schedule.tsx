import { Scheduler } from "@aldabil/react-scheduler";
import { SchedulerRef } from "@aldabil/react-scheduler/types";
import { useRef } from "react";
import { useThemeStore } from "../store/themeStore";
import SchedulerEditor from "../components/SchedulerEditor";
import { OptionType } from "../../../shared/models";
import { Button } from "../components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { deleteEvent, fetchUserEvents } from "../api/events";
import { useToast } from "../hooks/useToast";
import { MapPinIcon, PaperclipIcon, TextIcon } from "lucide-react";

const Schedule = () => {
	const { theme } = useThemeStore();
	const { id } = useParams();
	const navigate = useNavigate();
	const { toast } = useToast();
	const schedulerRef = useRef<SchedulerRef>(null);

	const { data } = useQuery({
		queryKey: ["events", id],
		queryFn: () => fetchUserEvents(id!),
		refetchOnWindowFocus: false,
	});

	const handleDelete = async (event_id: string | number): Promise<string | number | void> => {
		await deleteEvent(event_id.toString())
			.then(() => {
				toast({
					description: "✅ Event deleted successfully.",
				});
			})
			.catch(() => {
				toast({
					description: "😓 Failed to delete event.",
					variant: "destructive",
				});
			});
		return new Promise((res) => {
			res(event_id);
		});
	};

	return (
		<>
			<div className="flex flex-col text-center border-b border-slate-200 dark:border-gray-800 sm:text-left">
				<h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Schedule</h1>
				<p className="pt-3 pb-3 text-sm text-slate-400">
					Here you can mark all your important events and link your tests to them.
				</p>
			</div>
			{data && Array.isArray(data) && (
				<div className={`${theme === "dark" ? "darkmode-scheduler" : "lightmode-scheduler"}`}>
					<Scheduler
						ref={schedulerRef}
						customEditor={(scheduler) => (
							<SchedulerEditor scheduler={scheduler} schedulerRef={schedulerRef} />
						)}
						viewerExtraComponent={(_fields, event) => {
							return (
								<div className="flex flex-col gap-5 mt-5">
									{event?.description.length > 1 && (
										<>
											<div className="flex gap-2">
												<MapPinIcon className="w-5 h-5" />
												<p>{event.location}</p>
											</div>
											<div className="flex gap-2">
												<TextIcon className="w-5 h-5" />
												<p>{event.description}</p>
											</div>
										</>
									)}
									{event?.testOptions.length > 0 && (
										<div className="flex items-center gap-2">
											<PaperclipIcon className="w-5 h-5" />
											<div className="flex flex-col w-full gap-2">
												{event?.testOptions &&
													event?.testOptions.map((test: OptionType) => (
														<div
															key={test.value}
															className={`${
																theme === "dark" ? "bg-doodle-dark" : "bg-doodle-light"
															} flex items-center justify-between gap-1 p-2 border rounded-sm border-slate-200 dark:border-zinc-900`}
														>
															<p className="font-bold">{test.label}</p>
															<Button
																size={"sm"}
																className="bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600"
																onClick={() => navigate(`/solve/${test.value}`)}
															>
																Start
															</Button>
														</div>
													))}
											</div>
										</div>
									)}
								</div>
							);
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
						onDelete={handleDelete}
						events={data}
					/>
				</div>
			)}
		</>
	);
};

export default Schedule;
