import { cn } from "../../lib/utils";
import { Check } from "lucide-react";

interface Props {
	className?: string;
	values: string[];
	selectedColor: string;
	onColorSelect: (color: string) => void;
}

const ColorPicker = ({ className, values, selectedColor, onColorSelect }: Props) => {
	return (
		<div className={cn(`${className} flex w-full gap-2`)}>
			{values.map((color) => (
				<div
					key={color}
					className="flex items-center justify-center w-5 h-5 rounded-full cursor-pointer"
					style={{ backgroundColor: color }}
					onClick={() => onColorSelect(color)}
				>
					{selectedColor === color && <Check className="w-3 h-3 text-white" />}
				</div>
			))}
		</div>
	);
};

export default ColorPicker;
