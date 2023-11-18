import { useSession } from "@clerk/clerk-react";
import { Input } from "../components/ui/Input";
import { useCallback, useState } from "react";
import { TestType } from "../../../shared/models";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import TestItem from "../components/TestItem";
import { notEmpty } from "../utils/genericUtils";
import { fetchBookmarkedTestsByUserId } from "../api/users";

const Bookmarked = () => {

    const { session } = useSession();
	const userId = session?.user.id;
	const [filterTitle, setFilterTitle] = useState<string>("");

	const filterTestsByTitle = useCallback(
		(tests: TestType[]) => {
			if (!filterTitle) return tests;
			return tests.filter((test) => test.title.toLowerCase().includes(filterTitle));
		},
		[filterTitle]
	);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["bookmarked", userId],
		queryFn: () => fetchBookmarkedTestsByUserId(userId!),
		select: filterTestsByTitle,
		refetchOnWindowFocus: false,
		enabled: !!userId,
	});

	return (
		<>
			<div className="w-full mx-auto ">
				<div className="flex flex-col mb-10 text-center border-b border-slate-200 dark:border-gray-800 sm:text-left">
					<h1 className="text-2xl font-bold">Bookmarked</h1>
					<p className="pt-3 pb-3 text-sm text-slate-400">
						Here you can manage bookmarked tests.
					</p>
				</div>
				<div className="flex flex-col gap-2 mx-auto mt-1 max-w-7xl">
					<div className="flex gap-2">
						<Input
							placeholder="Filter tests by title..."
							onChange={(e) => setFilterTitle(e.target.value)}
						/>
						<Button variant="outline" className="hover:bg-slate-200">
							Filter
						</Button>
					</div>
					{isLoading && !isError ? (
						<Spinner className="flex justify-center p-5" />
					) : (
						data?.map((test) => <TestItem key={test.id} test={test} />)
					)}
					{isError && <div className="flex justify-center p-5">Error loading tests 😓</div>}
					{data && !notEmpty(data) && (
						<div className="flex justify-center p-5">You have no bookmarked tests 😅</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Bookmarked;
