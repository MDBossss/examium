import {
	CloudDrizzleIcon,
	CloudFogIcon,
	CloudLightningIcon,
	CloudRainIcon,
	CloudRainWindIcon,
	CloudSnowIcon,
	CloudSunIcon,
	SunIcon,
} from "lucide-react";



export function getWeatherIcon(code: number,className:string) {
	switch (code) {
		case 0:
			return <SunIcon className={className} />;
		case 1:
		case 2:
		case 3:
			return <CloudSunIcon className={className} />;
		case 45:
		case 48:
			return <CloudFogIcon className={className} />;
		case 51:
		case 53:
		case 55:
		case 56:
		case 57:
			return <CloudDrizzleIcon className={className} />;
		case 61:
		case 63:
		case 65:
		case 66:
		case 67:
			return <CloudRainIcon className={className} />;
		case 71:
		case 73:
		case 75:
		case 77:
			return <CloudSnowIcon className={className} />;
		case 80:
		case 81:
		case 82:
			return <CloudRainWindIcon className={className} />;
		case 85:
		case 86:
			return <CloudSnowIcon className={className} />;
		case 95:
		case 96:
		case 99:
			return <CloudLightningIcon className={className} />;

		default:
			return <SunIcon className={className} />;
	}
}
