import { Skeleton } from "./ui/Skeleton";

interface Props {
	number: number;
	className?: string;
}
const GenerateMultipleSkeletons = ({ number, className }: Props) => {
	const skeletonArray = Array.from({ length: number });

	return (
		<>
			{skeletonArray.map((_, index) => (
				<Skeleton key={index} className={className} />
			))}
		</>
	);
};

export default GenerateMultipleSkeletons;
