import { v4 as uuidv4 } from "uuid";
import type { SchedulerHelpers, SchedulerRef } from "@aldabil/react-scheduler/types";
import { RefObject, useState } from "react";
import { Input } from "./ui/Input";
import DateTimePicker from "./ui/DateTimePicker";
import { Label } from "./ui/Label";
import { Button } from "./ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/Dialogs/Dialog";
import { Checkbox } from "./ui/Checkbox";
import ColorPicker from "./ui/ColorPicker";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "./ui/Select";
import { generateRepeatingEvents } from "../utils/dateUtils";
import { isBefore } from "date-fns";
import { useToast } from "../hooks/useToast";
import { MultiSelect } from "./ui/MultiSelect";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@clerk/clerk-react";
import { EventType, OptionType } from "../../../shared/models";
import { fetchTestsByUserId } from "../api/tests";
import { createEvent, updateEvent } from "../api/events";

interface Props {
	scheduler: SchedulerHelpers;
	schedulerRef: RefObject<SchedulerRef>;
}

const SchedulerEditor = ({ scheduler, schedulerRef }: Props) => {
	const event = scheduler.edited;

	const { toast } = useToast();
	const { session } = useSession();
	const userId = session?.user.id;
	const [testOptions, setTestOptions] = useState<OptionType[]>([]);
	const [state, setState] = useState<EventType>({
		event_id: event?.event_id || uuidv4(),
		title: scheduler.state.title.value,
		description: event?.description || "",
		location: event?.location,
		start: scheduler.state.start.value,
		end: scheduler.state.end.value,
		allDay: event?.allDay,
		color: (event?.color as string) || "#3b82f6",
		repeatPattern: event?.repeatPattern || "NONE",
		testOptions: event?.testOptions || [],
	});

	useQuery({
		queryKey: ["tests", userId],
		queryFn: () => fetchTestsByUserId(userId!),
		refetchOnWindowFocus: false,
		onSuccess: (data) => {
			const newTestOptions: OptionType[] = [];
			data.map((test) => {
				newTestOptions.push({ label: test.title, value: test.id });
			});
			setTestOptions(newTestOptions);
		},
	});

	const handleChange = (value: any, name: string) => {
		setState((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};

	const handleSubmit = async () => {
		if (state.title?.length < 2) {
			toast({
				title: "Title is too short!",
				description: "Title has to be at least 3 characters long",
				variant: "destructive",
			});
			return;
		}

		if (state.title?.length > 50) {
			toast({
				title: "Title is too long!",
				description: "Title cannot be longer than 50 characters",
				variant: "destructive",
			});
		}

		if (state.description?.length > 300) {
			toast({
				title: "Description is too long!",
				description: "Description cannot be longer than 300 characters",
				variant: "destructive",
			});
		}

		if(state.location.length < 2){
			toast({
				title: "Location is too short!",
				description: "Location has to be at least 3 characters long",
				variant: "destructive",
			});
		}

		if(state.location.length > 127){
			toast({
				title: "Location is too long!",
				description: "Location cannot be longer than 128 characters",
				variant: "destructive",
			});
		}

		if (isBefore(new Date(state.end), new Date(state.start))) {
			toast({
				title: "Invalid date",
				description: "Event end cannot be before the event start!",
				variant: "destructive",
			});
			return;
		}

		try {
			scheduler.loading(true);

			// If editing event update else create
			if (!event) {
				await createEvent(state, userId!)
					.then(() => {
						toast({
							description: "✅ Event created successfully.",
						});
					})
					.catch(() => {
						toast({
							description: "😓 Failed to create event.",
							variant: "destructive",
						});
					});
			} else {
				await updateEvent(state, userId!)
					.then(() => {
						toast({
							description: "✅ Event updated successfully.",
						});
					})
					.catch(() => {
						toast({
							description: "😓 Failed to update event.",
							variant: "destructive",
						});
					});
			}

			let editSingleValue = true;
			schedulerRef.current?.scheduler.events.filter((e) => {
				if (
					event &&
					(state.repeatPattern !== "NONE" || e.repeatPattern !== "NONE") &&
					e.event_id === state.event_id
				) {
					// Return false to exclude the item from the filtered array
					editSingleValue = false;
					return false;
				}
				// Return true to keep the item
				return true;
			});

			// Removing existing events if has repeatPattern
			if (schedulerRef.current && schedulerRef.current.scheduler && !editSingleValue) {
				const events = schedulerRef.current.scheduler.events;
				const indicesToRemove = [];

				// Find the indexes of the elements to remove based on the provided condition
				for (let i = 0; i < events.length; i++) {
					const event = events[i];
					if (
						event &&
						(state.repeatPattern !== "NONE" || event.repeatPattern !== "NONE") &&
						event.event_id === state.event_id
					) {
						indicesToRemove.push(i);
					}
				}

				/**Remove the elements at the found indices in reverse order to avoid shifting issues
				 *  when removing from the front ( if delete 2nd item, everything shifts forward) */
				for (let i = indicesToRemove.length - 1; i >= 0; i--) {
					const indexToRemove = indicesToRemove[i];
					schedulerRef.current.scheduler.events.splice(indexToRemove, 1);
				}
			}

			scheduler.onConfirm(
				generateRepeatingEvents(state),
				event && editSingleValue ? "edit" : "create"
			);
			scheduler.close();
		} finally {
			scheduler.loading(false);
		}
	};

	return (
		<div>
			<Dialog defaultOpen onOpenChange={(e) => !e && scheduler.close()}>
				<DialogContent className="sm:max-w-[425px] z-[9999]">
					<DialogHeader>
						<DialogTitle>{event ? "Edit event" : "Create event"}</DialogTitle>
						<DialogDescription>Select where and when is the event happening.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid items-center grid-cols-4 gap-4">
							<Label htmlFor="title" className="text-right">
								Title
							</Label>
							<Input
								id="title"
								placeholder="Insert title..."
								value={state.title}
								className="col-span-3"
								onChange={(e) => handleChange(e.target.value, "title")}
								maxLength={50}
							/>
						</div>
						<div className="grid items-center grid-cols-4 gap-4">
							<Label htmlFor="event-description" className="text-right">
								Description
							</Label>
							<Input
								id="event-description"
								placeholder="Insert description..."
								value={state.description}
								className="col-span-3"
								onChange={(e) => handleChange(e.target.value, "description")}
							/>
						</div>
						<div className="grid items-center grid-cols-4 gap-4">
							<Label htmlFor="event-location" className="text-right">
								Location
							</Label>
							<Input
								id="event-location"
								placeholder="Insert location..."
								value={state.location}
								className="col-span-3"
								onChange={(e) => handleChange(e.target.value, "location")}
							/>
						</div>
						<div className="grid items-center grid-cols-4 gap-4">
							<Label className="text-right">Event start</Label>
							<DateTimePicker
								id="firsttimepicker"
								date={state.start as Date}
								setDate={(date) => handleChange(date, "start")}
								className="col-span-3"
							/>
						</div>
						<div className="grid items-center grid-cols-4 gap-4">
							<Label className="text-right">Event end</Label>
							<DateTimePicker
								id="secondtimepicker"
								date={state.end as Date}
								setDate={(date) => handleChange(date, "end")}
								className="col-span-3"
							/>
						</div>
						<div className="grid items-center grid-cols-4 gap-4">
							<Label className="text-right">Repeat</Label>
							<Select
								onValueChange={(value: string) => handleChange(value, "repeatPattern")}
								defaultValue={state.repeatPattern}
							>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select..."></SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Timeframe</SelectLabel>
										<SelectItem value={"NONE"}>None</SelectItem>
										<SelectItem value={"DAILY"}>Daily</SelectItem>
										<SelectItem value={"WEEKLY"}>Weekly</SelectItem>
										<SelectItem value={"MONTHLY"}>Monthly</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div className="grid items-center grid-cols-4 gap-4">
							<Label className="text-right">Link tests</Label>
							<MultiSelect
								placeholder="Select related tests..."
								options={testOptions}
								onChange={(options) => handleChange(options, "testOptions")}
								selected={state.testOptions}
								className="col-span-3"
							/>
						</div>
						<div className="grid items-center grid-cols-4 gap-4">
							<Label htmlFor="allDay" className="text-right">
								All day
							</Label>
							<Checkbox
								id="allDay"
								checked={state.allDay || false}
								onCheckedChange={(checked) => handleChange(checked, "allDay")}
								className="col-span-3"
							/>
						</div>
						<div className="grid items-center grid-cols-4 gap-4">
							<Label className="text-right">Color</Label>
							<ColorPicker
								className="col-span-3"
								selectedColor={state.color}
								onColorSelect={(color) => handleChange(color, "color")}
								values={["#3b82f6", "#dc2626", "#f97316", "#15803d", "#78716c"]}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit" onClick={handleSubmit}>
							Save changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default SchedulerEditor;
