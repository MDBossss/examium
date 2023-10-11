import { useQuery } from "@tanstack/react-query";
import { getCoordinatesFromLocationName, getWeatherData } from "../../api/weather";
import { fetchUserById } from "../../api/users";
import { ActiveSessionResource } from "@clerk/types";
import { LocationType, WeatherDataType } from "../../../../shared/models";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { CloudRainIcon, PencilIcon } from "lucide-react";
import Spinner from "../ui/Spinner";
import { getWeatherIcon } from "../../utils/weatherUtils";
import { format } from "date-fns";

interface Props {
	session: ActiveSessionResource | null | undefined;
}

const Forecast = ({ session }: Props) => {
	const userId = session?.user.id;
	const { toast } = useToast();
	const [location, setLocation] = useState<LocationType | undefined>();
	const [weatherData, setWeatherData] = useState<WeatherDataType>();

	console.log(weatherData);

	useQuery({
		queryKey: ["users", userId, location?.name],
		queryFn: () => fetchUserById(userId!),
		refetchOnWindowFocus: false,
		onSuccess: (data) => {
			console.log("Fetched location from DB");
			if (data) {
				setLocation({
					name: data.locationName,
					latitude: data.latitude,
					longitude: data.longitude,
				});
				fetchWeather(data.latitude, data.longitude);
			}
		},
		enabled: !location,
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

	const handleChangeCity = () => {
		//open popup with input and write to db if valid
		//get city coords first and if array is not empty
		//then call the weather api and update the location to db
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
					<h1
						className="flex items-center gap-2 text-3xl cursor-pointer hover:underline"
						onClick={handleChangeCity}
					>
						{location?.name}
					</h1>
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
							{getWeatherIcon(weatherData.daily.weathercode[i], "h-10 w-10")}
							<p>{format(new Date(weatherData.daily.time[i]),"EEE")}</p>
						</div>
					))}
				</div>
			</div>
	);
};

export default Forecast;
