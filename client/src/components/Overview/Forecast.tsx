import { useQuery } from "@tanstack/react-query";
import { getCoordinatesFromLocationName, getWeatherData } from "../../api/weather";
import { fetchUserById, updateUserLocation } from "../../api/users";
import { ActiveSessionResource } from "@clerk/types";
import { LocationType, WeatherDataType } from "../../../../shared/models";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import Spinner from "../ui/Spinner";
import { getWeatherIcon } from "../../utils/weatherUtils";
import { format } from "date-fns";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/Dialogs/Dialog";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { z } from "zod";

const cityNameSchema = z
	.string()
	.min(3, "City name must be at least 3 characters long!")
	.max(100, "City name must be at most 100 characters!");

interface Props {
	session: ActiveSessionResource | null | undefined;
}

const Forecast = ({ session }: Props) => {
	const userId = session?.user.id;
	const { toast } = useToast();
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [location, setLocation] = useState<LocationType | undefined>();
	const [cityName, setCityName] = useState<string>(location?.name || "");
	const [weatherData, setWeatherData] = useState<WeatherDataType>();

	useQuery({
		queryKey: ["users", location?.name],
		queryFn: () => fetchUserById(userId!),
		refetchOnWindowFocus: false,
		onSuccess: (data) => {
			if (data) {
				fetchWeather(data.latitude, data.longitude);
				setLocation({
					name: data.locationName,
					latitude: data.latitude,
					longitude: data.longitude,
				});
			}
		},
		enabled: !location && userId ? true : false,
	});

	const fetchWeather = async (latitude: number, longitude: number) => {
		try {
			const response = await getWeatherData(latitude, longitude);
			setWeatherData(response);
		} catch (err) {
			toast({
				title: "Couldn't update weather data",
				variant: "destructive",
			});
		}
	};

	const handleChangeCity = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();

		const res = cityNameSchema.safeParse(cityName);
		if (!res.success) {
			res.error.issues.map((issue) => {
				toast({
					description: issue.message,
					variant: "destructive",
				});
			});
			return;
		}

		await getCoordinatesFromLocationName(cityName)
			.then((res) => {
				fetchWeather(res.latitude, res.longitude);
				setLocation({ name: res.name, latitude: res.latitude, longitude: res.longitude });
				updateUserLocation(userId!, {
					name: res.name,
					latitude: res.latitude,
					longitude: res.longitude,
				});
				toast({
					title: "✅ City updated.",
				});
				setDialogOpen(false);
			})
			.catch((err) => {
				toast({
					description: err.response.data.message,
					variant: "destructive",
				});
			});
	};

	if (!weatherData) {
		return (
			<div className="p-5 border rounded-sm">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full gap-5 p-5 border rounded-sm">
			<div className="flex items-center justify-between w-full gap-2 pb-5 border-b">
				{getWeatherIcon(weatherData?.current.weathercode, "h-20 w-20")}
				<div className="flex flex-col items-center justify-center gap-1">
					<h1 className="text-3xl">
						{weatherData.current.temperature_2m}
						<span className="text-sm align-top">{weatherData.current_units.temperature_2m}</span>
					</h1>
					<h2 className="text-xs text-slate-500">
						Feels like {weatherData.current.apparent_temperature}
					</h2>
				</div>
			</div>
			<div className="flex items-center justify-between gap-2">
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger>
						<h1
							className="flex items-center gap-2 text-3xl cursor-pointer hover:underline"
							onClick={() => setDialogOpen(true)}
						>
							{location?.name}
						</h1>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Edit location</DialogTitle>
							<DialogDescription>
								Change the location from which the weather data gets displayed from.
							</DialogDescription>
						</DialogHeader>
						<form>
							<div className="grid gap-4 py-4">
								<div className="grid items-center grid-cols-4 gap-4">
									<Label htmlFor="city" className="text-right">
										City name
									</Label>
									<Input
										id="city"
										name="city"
										defaultValue={location?.name}
										onChange={(e) => setCityName(e.target.value)}
										className="col-span-3"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit" onClick={(e) => handleChangeCity(e)}>
									Save changes
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>

				<div className="flex gap-4">
					<div className="flex flex-col items-center text-gray-500">
						<p className="text-xs">HUMIDITY</p>
						<h4 className="text-xl">
							{weatherData.current.relativehumidity_2m}
							<span className="text-sm align-center">
								{weatherData.current_units.relativehumidity_2m}
							</span>
						</h4>
					</div>
					<div className="flex flex-col items-center text-gray-500">
						<p className="text-xs">WIND SPEED</p>
						<h4 className="text-xl">
							{weatherData.current.windspeed_10m}
							<span className="text-sm align-center">
								{weatherData.current_units.windspeed_10m}
							</span>
						</h4>
					</div>
				</div>
			</div>
			<div className="flex justify-between gap-2 p-2 mt-auto">
				{weatherData.daily.weathercode.map((_, i) => (
					<div key={i} className="flex flex-col items-center justify-center gap-1">
						<p className="text-xs text-gray-500">
							{weatherData.daily.temperature_2m_max[i]}
							{weatherData.daily_units.temperature_2m_max}
						</p>
						{getWeatherIcon(weatherData.daily.weathercode[i], "h-10 w-10")}
						<p>{format(new Date(weatherData.daily.time[i]), "EEE")}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Forecast;
