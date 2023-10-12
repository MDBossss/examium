import axios from "axios";
import { LocationType, WeatherDataType } from "../../../shared/models";

export async function getCoordinatesFromLocationName(name: string) {
	try {
		const response = await axios.get(
			`https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=5&language=en&format=json`
		);

		if (!(response.data.results)) {
			throw {
			  response: {
				status: 404,
				data: { message: 'There is no such city!' },
			  },
			};
		  }

		return {
			name: response.data.results[0].name,
			latitude: response.data.results[0].latitude,
			longitude: response.data.results[0].longitude,
		} as LocationType;
	} catch (error) {
		throw error
	}
}

export async function getWeatherData(latitude:number,longitude:number){
    try{
        const response = await axios.get<WeatherDataType>(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relativehumidity_2m,apparent_temperature,is_day,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`);

        return response.data;
    }catch(error){
        throw new Error("Failed to get weather data!");
    }
}


