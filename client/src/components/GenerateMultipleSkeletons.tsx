import { Skeleton } from "./ui/Skeleton";

const GenerateMultipleSkeletons = ({
	number,
	className,
}: {
	number: number;
	className?: string;
}) => {
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
