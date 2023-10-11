import { AlignJustifyIcon, LayoutGridIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { ActiveSessionResource } from "@clerk/types";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTodayUserEvents } from "../../api/events";
import Spinner from "../ui/Spinner";
import { notEmpty } from "../../utils/genericUtils";
import PracticeTodayItem from "./PracticeTodayItem";
import UpcomingEventItem from "./UpcomingEventItem";
import isAfter from "date-fns/isAfter";

interface Props {
	session: ActiveSessionResource | null | undefined;
}

const EventActivity = ({ session }: Props) => {
	const currentTime = new Date();
	const userId = session?.user.id;
	const navigate = useNavigate();
	const [selectedLayout, setSelectedLayout] = useState<"grid" | "column">("column");
	const [showAllEvents, setShowAllEvents] = useState<boolean>(false);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["events", "currentTime", userId],
		queryFn: () => fetchTodayUserEvents(userId!),
		refetchOnWindowFocus: false,
	});

	const isTherePracticeToday = () => {
		let value: boolean = false;
		data?.map((event) => {
			event.selectedTests?.map(() => {
				value = true;
			});
		});
		return value;
	};

	const filteredData = data?.filter((event) => isAfter(new Date(event.start), currentTime));

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-6 px-4 pt-6 pb-2 border rounded-sm border-slate-200 dark:border-gray-800">
				<div className="flex space-between">
					<div className="flex flex-col flex-1 gap-3">
						<h2 className="text-2xl font-bold">Event activity</h2>
						<h3>
							{currentTime.toLocaleDateString(undefined, {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</h3>
					</div>
					<div className="flex flex-col">
						<Button
							className="flex-1 p-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
							onClick={() => navigate(`/schedule/${session?.user.id}`)}
						>
							<PlusIcon />
						</Button>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex justify-between gap-2">
						<h4 className="font-medium">Practice today</h4>
						<div className="flex gap-2">
							<LayoutGridIcon
								fill="#e2e8f0"
								onClick={() => setSelectedLayout("grid")}
								className={`${
									selectedLayout === "grid" && "bg-blue-500 dark:bg-blue-700 text-slate-200 "
								} w-6 h-6 p-1 rounded-full cursor-pointer`}
							/>
							<AlignJustifyIcon
								fill="#e2e8f0"
								onClick={() => setSelectedLayout("column")}
								className={`${
									selectedLayout === "column" && "bg-blue-500 dark:bg-blue-700 text-slate-200"
								} w-6 h-6 p-1 rounded-full cursor-pointer`}
							/>
						</div>
					</div>
					<div
						className={`${
							selectedLayout === "grid" && isTherePracticeToday()
								? "grid grid-cols-2"
								: "flex flex-col"
						} gap-3 px-2`}
					>
						{isLoading && !isError ? (
							<Spinner />
						) : (
							data?.map((event) =>
								event.selectedTests?.map((test) => (
									<PracticeTodayItem key={test.id} test={test} selectedLayout={selectedLayout} />
								))
							)
						)}
						{isError && <div className="flex justify-center p-5">Error loading tests 😓</div>}
						{data && !isTherePracticeToday() && (
							<div className="p-5 bg-blue-500 rounded-sm cursor-pointer dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700">
								<div className="flex flex-col justify-between gap-5">
									<div className="flex flex-col gap-1">
										<h4 className="font-medium">Take a break!</h4>
										<p className="text-xs">You have no practice scheduled today!</p>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<h4 className="font-medium">{showAllEvents ? "Upcoming events" : "Upcoming event"}</h4>
					<div className="flex flex-col gap-5">
						{isLoading && !isError ? (
							<Spinner />
						) : (
							filteredData &&
							filteredData?.length > 0 && (
								<UpcomingEventItem key={filteredData[0].event_id} event={filteredData[0]} />
							)
						)}
						{showAllEvents &&
							filteredData
								?.slice(1)
								.map((event) => <UpcomingEventItem key={event.event_id} event={event} />)}
						{filteredData && filteredData.length > 0 && showAllEvents ? (
							<p
								className="self-center underline cursor-pointer"
								onClick={() => setShowAllEvents(false)}
							>
								Show less
							</p>
						) : filteredData && filteredData.length > 0 && !showAllEvents ? (
							<p
								className="self-center underline cursor-pointer"
								onClick={() => setShowAllEvents(true)}
							>
								Show All
							</p>
						) : null}
						{isError && <div className="flex justify-center p-5">Error loading tests 😓</div>}
						{filteredData && !notEmpty(filteredData) && (
							<div className="flex justify-center p-5">You have no more events today! 😅</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventActivity;
